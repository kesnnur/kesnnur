// utils.js - Complete Utility Functions for KESNNUR

/**
 * Utility Functions for KESNNUR Admin
 */

// ============================================
// FORMATTING FUNCTIONS
// ============================================

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(dateString, includeTime = false) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        
        return date.toLocaleDateString('en-KE', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date Error';
    }
}

// Format timestamp to relative time
function timeAgo(timestamp) {
    if (!timestamp) return 'N/A';
    
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'Invalid Date';
        
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
        
        const years = Math.floor(days / 365);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    } catch (error) {
        console.error('Error calculating time ago:', error);
        return 'Time Error';
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

// Validate email
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
}

// Validate phone number (Kenyan format)
function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    
    // Clean phone number
    const cleaned = phone.trim().replace(/\s+/g, '');
    
    // Accepts: +2547XXXXXXXX, 07XXXXXXXX, 2547XXXXXXXX
    const re = /^(\+254|0|254)?[17]\d{8}$/;
    return re.test(cleaned);
}

// Validate ID number (Kenyan)
function isValidIDNumber(id) {
    if (!id || typeof id !== 'string') return false;
    
    const re = /^\d{8}$/;
    return re.test(id.trim());
}

// Validate password strength
function validatePassword(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (!/[@$!%*?&]/.test(password)) {
        errors.push('Password must contain at least one special character (@$!%*?&)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

// Show notification
function showNotification(message, type = 'info') {
    const types = {
        success: {
            bg: 'bg-green-500',
            icon: 'check-circle',
            title: 'Success'
        },
        error: {
            bg: 'bg-red-500',
            icon: 'exclamation-circle',
            title: 'Error'
        },
        warning: {
            bg: 'bg-yellow-500',
            icon: 'exclamation-triangle',
            title: 'Warning'
        },
        info: {
            bg: 'bg-blue-500',
            icon: 'info-circle',
            title: 'Information'
        }
    };
    
    const config = types[type] || types.info;
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.kesnnur-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `kesnnur-notification fixed top-4 right-4 ${config.bg} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full max-w-md`;
    notification.innerHTML = `
        <div class="flex items-start">
            <i class="fas fa-${config.icon} mt-1 mr-3"></i>
            <div class="flex-1">
                <div class="font-semibold mb-1">${config.title}</div>
                <div class="text-sm opacity-90">${message}</div>
            </div>
            <button class="ml-4 opacity-70 hover:opacity-100" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Confirm dialog
async function showConfirm(message, title = 'Confirm Action') {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-md w-full animate-fade-in">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-exclamation-triangle text-yellow-500 text-xl mr-3"></i>
                        <h3 class="text-lg font-bold text-gray-800">${title}</h3>
                    </div>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <div class="flex justify-end space-x-3">
                        <button class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded transition-colors" id="cancelBtn">Cancel</button>
                        <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-medium transition-colors" id="confirmBtn">Confirm</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const cancelBtn = modal.querySelector('#cancelBtn');
        const confirmBtn = modal.querySelector('#confirmBtn');
        
        const closeModal = (result) => {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.remove();
                resolve(result);
            }, 300);
        };
        
        cancelBtn.onclick = () => closeModal(false);
        confirmBtn.onclick = () => closeModal(true);
        
        // Close on backdrop click
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeModal(false);
            }
        };
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal(false);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    });
}

// Show loader
function showLoader(element, size = 'md', text = '') {
    const sizes = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };
    
    const loaderSize = sizes[size] || sizes.md;
    
    const loader = document.createElement('div');
    loader.className = 'kesnnur-loader flex flex-col items-center justify-center p-4';
    loader.innerHTML = `
        <div class="animate-spin rounded-full ${loaderSize} border-b-2 border-blue-600 mb-2"></div>
        ${text ? `<div class="text-sm text-gray-600 mt-2">${text}</div>` : ''}
    `;
    
    if (typeof element === 'string') {
        const target = document.querySelector(element);
        if (target) {
            target.innerHTML = '';
            target.appendChild(loader);
        }
    } else if (element) {
        element.innerHTML = '';
        element.appendChild(loader);
    }
    
    return loader;
}

// Remove loader
function removeLoader(element) {
    if (typeof element === 'string') {
        const target = document.querySelector(element);
        if (target) {
            const loader = target.querySelector('.kesnnur-loader');
            if (loader) loader.remove();
        }
    } else if (element) {
        const loader = element.querySelector('.kesnnur-loader');
        if (loader) loader.remove();
    }
}

// ============================================
// DATA UTILITY FUNCTIONS
// ============================================

// Debounce function for search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll/resize events
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate unique ID
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${random}`;
}

// Deep clone object
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    return obj;
}

// Filter object by keys
function filterObject(obj, keys) {
    return keys.reduce((result, key) => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

// Group array by key
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

// ============================================
// STRING UTILITY FUNCTIONS
// ============================================

// Capitalize first letter
function capitalize(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Convert to title case
function toTitleCase(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Truncate text with ellipsis
function truncate(text, maxLength = 100) {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Slugify string for URLs
function slugify(str) {
    return str
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/&/g, '-and-')      // Replace & with 'and'
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

// ============================================
// FORM UTILITY FUNCTIONS
// ============================================

// Serialize form to object
function serializeForm(form) {
    if (!form || !(form instanceof HTMLFormElement)) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        // Handle multiple values (e.g., checkboxes)
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

// Validate form fields
function validateForm(form) {
    const errors = {};
    const fields = form.querySelectorAll('[data-validate]');
    
    fields.forEach(field => {
        const value = field.value.trim();
        const validations = field.dataset.validate.split(' ');
        
        validations.forEach(validation => {
            if (validation === 'required' && !value) {
                errors[field.name] = errors[field.name] || [];
                errors[field.name].push('This field is required');
            }
            
            if (validation === 'email' && value && !isValidEmail(value)) {
                errors[field.name] = errors[field.name] || [];
                errors[field.name].push('Please enter a valid email address');
            }
            
            if (validation === 'phone' && value && !isValidPhone(value)) {
                errors[field.name] = errors[field.name] || [];
                errors[field.name].push('Please enter a valid Kenyan phone number');
            }
        });
    });
    
    return errors;
}

// Show form errors
function showFormErrors(form, errors) {
    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.border-red-500').forEach(el => el.classList.remove('border-red-500'));
    
    // Add new errors
    Object.keys(errors).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('border-red-500');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error text-red-600 text-sm mt-1';
            errorDiv.textContent = errors[fieldName].join(', ');
            
            field.parentNode.appendChild(errorDiv);
        }
    });
}

// ============================================
// API RESPONSE HANDLERS
// ============================================

// Handle API success
function handleApiSuccess(response, successMessage = 'Operation successful') {
    if (successMessage) {
        showNotification(successMessage, 'success');
    }
    return response;
}

// Handle API error
function handleApiError(error, errorMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    const message = error?.message || errorMessage;
    showNotification(message, 'error');
    
    throw error;
}

// ============================================
// FILE UTILITY FUNCTIONS
// ============================================

// Read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Validate file type
function isValidFileType(file, allowedTypes) {
    if (!file || !allowedTypes) return false;
    
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return fileName.endsWith(type);
        }
        return fileType === type || fileType.startsWith(`${type}/`);
    });
}

// ============================================
// DOM UTILITY FUNCTIONS
// ============================================

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const target = typeof element === 'string' 
        ? document.querySelector(element)
        : element;
    
    if (!target) return;
    
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Toggle element visibility
function toggleElement(element, show = null) {
    if (!element) return;
    
    const target = typeof element === 'string' 
        ? document.querySelector(element)
        : element;
    
    if (!target) return;
    
    if (show === null) {
        show = target.classList.contains('hidden');
    }
    
    if (show) {
        target.classList.remove('hidden');
        target.classList.add('block');
    } else {
        target.classList.add('hidden');
        target.classList.remove('block');
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard', 'success');
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        showNotification('Failed to copy', 'error');
        return false;
    }
}

// ============================================
// SECURITY UTILITY FUNCTIONS
// ============================================

// Sanitize input
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

// Generate secure token
function generateToken(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    
    // Use crypto if available
    if (window.crypto && window.crypto.getRandomValues) {
        const values = new Uint8Array(length);
        window.crypto.getRandomValues(values);
        token = Array.from(values, x => chars[x % chars.length]).join('');
    } else {
        // Fallback for older browsers
        for (let i = 0; i < length; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    }
    
    return token;
}

// ============================================
// SESSION UTILITY FUNCTIONS
// ============================================

// Get user session
function getUserSession() {
    try {
        const session = localStorage.getItem('kesnnur_session');
        return session ? JSON.parse(session) : null;
    } catch (error) {
        console.error('Error reading session:', error);
        return null;
    }
}

// Set user session
function setUserSession(sessionData) {
    try {
        localStorage.setItem('kesnnur_session', JSON.stringify(sessionData));
        return true;
    } catch (error) {
        console.error('Error setting session:', error);
        return false;
    }
}

// Clear user session
function clearUserSession() {
    try {
        localStorage.removeItem('kesnnur_session');
        return true;
    } catch (error) {
        console.error('Error clearing session:', error);
        return false;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    const session = getUserSession();
    if (!session) return false;
    
    // Check if token is expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
        clearUserSession();
        return false;
    }
    
    return true;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

// Make functions available globally
window.Utils = {
    // Formatting
    formatCurrency,
    formatDate,
    timeAgo,
    formatFileSize,
    
    // Validation
    isValidEmail,
    isValidPhone,
    isValidIDNumber,
    validatePassword,
    
    // UI Helpers
    showNotification,
    showConfirm,
    showLoader,
    removeLoader,
    
    // Data Utilities
    debounce,
    throttle,
    generateId,
    deepClone,
    filterObject,
    groupBy,
    
    // String Utilities
    capitalize,
    toTitleCase,
    truncate,
    slugify,
    
    // Form Utilities
    serializeForm,
    validateForm,
    showFormErrors,
    
    // API Handlers
    handleApiSuccess,
    handleApiError,
    
    // File Utilities
    readFileAsDataURL,
    isValidFileType,
    
    // DOM Utilities
    smoothScrollTo,
    toggleElement,
    copyToClipboard,
    
    // Security
    sanitizeInput,
    generateToken,
    
    // Session Management
    getUserSession,
    setUserSession,
    clearUserSession,
    isAuthenticated
};

// Export for Node.js/CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.Utils;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('KESNNUR Utils initialized');
    
    // Add global styles for notifications
    if (!document.querySelector('#kesnnur-styles')) {
        const styles = document.createElement('style');
        styles.id = 'kesnnur-styles';
        styles.textContent = `
            .animate-fade-in {
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .form-error {
                animation: shake 0.5s;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(styles);
    }
});
