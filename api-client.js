// api-client.js - Secure API Client

class APIClient {
    constructor() {
        this.baseURL = window.CONFIG?.API?.ENDPOINTS?.BASE_URL || '';
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    // Generate cache key
    generateCacheKey(endpoint, params = {}) {
        return `${endpoint}:${JSON.stringify(params)}`;
    }

    // Check if cache is valid
    isCacheValid(cacheKey, ttl) {
        const cached = this.cache.get(cacheKey);
        if (!cached) return false;
        
        const now = Date.now();
        return (now - cached.timestamp) < ttl;
    }

    // Get cached data
    getCachedData(cacheKey) {
        return this.cache.get(cacheKey)?.data;
    }

    // Set cached data
    setCachedData(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }

    // Main request method
    async request(endpoint, options = {}) {
        const {
            method = 'GET',
            data = null,
            params = {},
            useCache = false,
            cacheTTL = 60000, // 1 minute default
            headers = {},
            retryCount = 3
        } = options;

        const cacheKey = this.generateCacheKey(endpoint, params);
        
        // Check cache first if enabled
        if (useCache && method === 'GET' && this.isCacheValid(cacheKey, cacheTTL)) {
            return this.getCachedData(cacheKey);
        }

        // Check for duplicate pending requests
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }

        try {
            // Build URL
            let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
            
            // Add query parameters for GET requests
            if (method === 'GET' && params && Object.keys(params).length > 0) {
                const queryParams = new URLSearchParams(params);
                url += `?${queryParams.toString()}`;
            }

            // Prepare request options
            const requestOptions = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...headers
                },
                credentials: 'same-origin', // Include cookies for auth
                mode: 'cors',
                cache: 'no-cache'
            };

            // Add body for non-GET requests
            if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
                requestOptions.body = JSON.stringify(data);
            }

            // Make request with retry logic
            let lastError;
            for (let attempt = 1; attempt <= retryCount; attempt++) {
                try {
                    const response = await fetch(url, requestOptions);
                    
                    // Handle different response types
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
                    }

                    // Parse response
                    const contentType = response.headers.get('content-type');
                    let result;
                    
                    if (contentType && contentType.includes('application/json')) {
                        result = await response.json();
                    } else {
                        result = await response.text();
                    }

                    // Cache the response if caching is enabled
                    if (useCache && method === 'GET') {
                        this.setCachedData(cacheKey, result);
                    }

                    // Remove from pending requests
                    this.pendingRequests.delete(cacheKey);

                    return result;

                } catch (error) {
                    lastError = error;
                    
                    // Exponential backoff for retries
                    if (attempt < retryCount) {
                        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }

            throw lastError;

        } catch (error) {
            // Remove from pending requests on error
            this.pendingRequests.delete(cacheKey);
            
            console.error(`API Request failed for ${endpoint}:`, error);
            
            // Provide fallback data for critical endpoints
            const fallback = this.getFallbackData(endpoint);
            if (fallback) {
                console.warn(`Using fallback data for ${endpoint}`);
                return fallback;
            }
            
            throw error;
        }
    }

    // Get fallback data when API fails
    getFallbackData(endpoint) {
        const fallbackMap = {
            '/api/stats/public': {
                members: 1500,
                events: 50,
                chapters: 24,
                registered: 100
            },
            '/api/events/public': [
                {
                    id: 'fallback-1',
                    title: 'Clinical Skills Workshop',
                    description: 'Hands-on training on advanced clinical procedures',
                    date: new Date(Date.now() + 7 * 86400000).toISOString(),
                    location: 'KNH Training Center, Nairobi',
                    category: 'workshop',
                    status: 'upcoming',
                    color: 'from-blue-600 to-blue-400'
                },
                {
                    id: 'fallback-2',
                    title: 'Annual Nursing Conference',
                    description: 'Networking with industry leaders',
                    date: new Date(Date.now() + 14 * 86400000).toISOString(),
                    location: 'Virtual & On-site',
                    category: 'conference',
                    status: 'upcoming',
                    color: 'from-teal-600 to-teal-400'
                }
            ],
            '/api/blog/public': [
                {
                    id: 'fallback-1',
                    title: 'Balancing Studies and Clinical Rotations',
                    excerpt: 'Practical tips for nursing students',
                    content: 'Full article content here...',
                    author: 'Jane Mwangi',
                    category: 'student-life',
                    created_at: new Date().toISOString(),
                    image: window.CONFIG?.CONTENT?.IMAGES?.DEFAULT_BLOG
                }
            ]
        };

        return fallbackMap[endpoint] || null;
    }

    // Specific API methods
    async getStats() {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.STATS_PUBLIC, {
            useCache: true,
            cacheTTL: window.CONFIG?.API?.CACHE_TTL?.STATS || 300000
        });
    }

    async getEvents(limit = 3) {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.EVENTS_PUBLIC, {
            params: { limit, status: 'upcoming' },
            useCache: true,
            cacheTTL: window.CONFIG?.API?.CACHE_TTL?.EVENTS || 600000
        });
    }

    async getBlogPosts(limit = 3) {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.BLOG_PUBLIC, {
            params: { limit, published: true },
            useCache: true,
            cacheTTL: window.CONFIG?.API?.CACHE_TTL?.BLOG || 900000
        });
    }

    async getPartners() {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.PARTNERS, {
            useCache: true,
            cacheTTL: 3600000 // 1 hour
        });
    }

    async subscribeNewsletter(email) {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.NEWSLETTER, {
            method: 'POST',
            data: { email }
        });
    }

    async submitContact(formData) {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.CONTACT, {
            method: 'POST',
            data: formData
        });
    }

    // Admin methods (require auth)
    async createEvent(eventData) {
        return this.request(window.CONFIG?.API?.ENDPOINTS?.EVENTS_ADMIN, {
            method: 'POST',
            data: eventData,
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });
    }

    async updateEvent(id, eventData) {
        return this.request(`${window.CONFIG?.API?.ENDPOINTS?.EVENTS_ADMIN}/${id}`, {
            method: 'PUT',
            data: eventData,
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });
    }

    async deleteEvent(id) {
        return this.request(`${window.CONFIG?.API?.ENDPOINTS?.EVENTS_ADMIN}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });
    }

    // Auth helper methods
    getAuthToken() {
        return localStorage.getItem('kesnnur_auth_token') || 
               sessionStorage.getItem('kesnnur_auth_token');
    }

    setAuthToken(token, remember = false) {
        if (remember) {
            localStorage.setItem('kesnnur_auth_token', token);
        } else {
            sessionStorage.setItem('kesnnur_auth_token', token);
        }
    }

    clearAuthToken() {
        localStorage.removeItem('kesnnur_auth_token');
        sessionStorage.removeItem('kesnnur_auth_token');
    }

    isAuthenticated() {
        return !!this.getAuthToken();
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        this.pendingRequests.clear();
    }

    // Clear cache for specific endpoint
    clearCacheFor(endpoint) {
        const keysToDelete = [];
        for (const [key] of this.cache) {
            if (key.startsWith(endpoint)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => this.cache.delete(key));
    }
}

// Create global instance
const apiClient = new APIClient();

// Export for different environments
if (typeof window !== 'undefined') {
    window.API = apiClient;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIClient, apiClient };
}
