// config.js - Complete Configuration
const SUPABASE_CONFIG = {
    url: 'https://noadhwqvaxajuckpibbo.supabase.co',
    publishableKey: 'sb_publishable_P02egT5dJQkzvkxz5wETyQ_vZkdcxxz',
    // Note: Secret key should ONLY be used in server-side/Edge Functions
    // Never expose in browser/client-side code
};

// GitHub Configuration
const GITHUB_CONFIG = {
    owner: 'kesnnur',
    repo: 'kesnnur',
    branch: 'main',
    contentPath: 'content', // Folder where content will be stored
    // Note: GitHub token will be fetched from Supabase environment variables
};

// API Configuration
const API_CONFIG = {
    // Public API endpoints (these will go through secure proxy)
    ENDPOINTS: {
        // Public endpoints (no auth required)
        EVENTS_PUBLIC: '/api/events/public',
        BLOG_PUBLIC: '/api/blog/public',
        STATS_PUBLIC: '/api/stats/public',
        PARTNERS: '/api/partners',
        CONTACT: '/api/contact',
        NEWSLETTER: '/api/newsletter',
        
        // Protected endpoints (require auth)
        EVENTS_ADMIN: '/api/events/admin',
        BLOG_ADMIN: '/api/blog/admin',
        MEMBERS: '/api/members',
        DASHBOARD: '/api/dashboard'
    },
    
    // Caching configuration
    CACHE_TTL: {
        STATS: 300000, // 5 minutes
        EVENTS: 600000, // 10 minutes
        BLOG: 900000 // 15 minutes
    },
    
    // Rate limiting
    RATE_LIMIT: {
        PUBLIC: 100, // requests per 15 minutes
        AUTHENTICATED: 1000 // requests per 15 minutes
    }
};

// Admin Roles and Permissions
const ADMIN_CONFIG = {
    ROLES: ['chapter_admin', 'national_admin', 'super_admin'],
    
    PERMISSIONS: {
        chapter_admin: [
            'view_events',
            'create_events',
            'edit_own_events',
            'view_members',
            'view_reports'
        ],
        national_admin: [
            'view_events',
            'create_events',
            'edit_all_events',
            'delete_events',
            'manage_members',
            'view_reports',
            'manage_content'
        ],
        super_admin: [
            'view_events',
            'create_events',
            'edit_all_events',
            'delete_events',
            'manage_members',
            'view_reports',
            'manage_content',
            'manage_admins',
            'system_settings'
        ]
    }
};

// App Configuration
const APP_CONFIG = {
    NAME: 'KESNNUR',
    VERSION: '2.0.0',
    DESCRIPTION: 'Kenya Students & Novice Nurses',
    SUPPORT_EMAIL: 'kesnnur@gmail.com',
    SUPPORT_PHONE: '+254791296924',
    WEBSITE_URL: 'https://kesnnur.github.io/kesnnur',
    
    // Feature flags
    FEATURES: {
        MEMBER_PORTAL: true,
        EVENT_REGISTRATION: true,
        BLOG_COMMENTS: true,
        ONLINE_PAYMENTS: false, // Set to true when ready
        SMS_NOTIFICATIONS: false // Set to true when ready
    },
    
    // Social media links
    SOCIAL: {
        TWITTER: 'https://twitter.com/kesnnur',
        FACEBOOK: 'https://facebook.com/kesnnur',
        INSTAGRAM: 'https://instagram.com/kesnnur',
        LINKEDIN: 'https://linkedin.com/company/kesnnur',
        WHATSAPP: 'https://wa.me/254791296924'
    },
    
    // Payment configuration (when enabled)
    PAYMENT: {
        PROVIDER: 'mpesa', // mpesa, stripe, paypal
        CURRENCY: 'KES',
        TEST_MODE: true // Set to false in production
    }
};

// Content Configuration
const CONTENT_CONFIG = {
    // Default images for fallback
    IMAGES: {
        DEFAULT_EVENT: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136',
        DEFAULT_BLOG: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf',
        DEFAULT_HERO: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54',
        AVATAR_PLACEHOLDER: 'https://ui-avatars.com/api/?name=Kesnnur&background=1e3a8a&color=fff'
    },
    
    // Content categories
    CATEGORIES: {
        EVENTS: ['workshop', 'conference', 'seminar', 'webinar', 'networking', 'training'],
        BLOG: ['student-life', 'career-tips', 'clinical-skills', 'mental-health', 'research', 'news'],
        RESOURCES: ['guidelines', 'templates', 'research-papers', 'tools', 'videos']
    },
    
    // Content limits
    LIMITS: {
        EVENTS_PER_PAGE: 12,
        BLOG_PER_PAGE: 10,
        RESOURCES_PER_PAGE: 20
    }
};

// Export configuration
if (typeof window !== 'undefined') {
    // Browser environment
    window.CONFIG = {
        SUPABASE: SUPABASE_CONFIG,
        GITHUB: GITHUB_CONFIG,
        API: API_CONFIG,
        ADMIN: ADMIN_CONFIG,
        APP: APP_CONFIG,
        CONTENT: CONTENT_CONFIG
    };
}

if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        SUPABASE_CONFIG,
        GITHUB_CONFIG,
        API_CONFIG,
        ADMIN_CONFIG,
        APP_CONFIG,
        CONTENT_CONFIG
    };
}
