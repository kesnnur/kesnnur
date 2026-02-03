// config.js - Updated for new Supabase API keys format
const SUPABASE_CONFIG = {
    url: 'https://noadhwqvaxajuckpibbo.supabase.co',
    publishableKey: 'sb_publishable_P02egT5dJQkzvkxz5wETyQ_vZkdcxxz',
    // Note: Secret key should ONLY be used in server-side/Edge Functions
    // Never expose in browser/client-side code
};

// GitHub Configuration
const GITHUB_CONFIG = {
    owner: 'kesnnur',      // Your GitHub username
    repo: 'kesnnur',       // Your repository name
    branch: 'main',        // Your default branch
    // Note: GitHub token will be fetched from Supabase environment variables
    // via a secure Edge Function
};

// Admin Roles
const ADMIN_ROLES = ['chapter_admin', 'national_admin', 'super_admin'];

// App Configuration
const APP_CONFIG = {
    appName: 'KESNNUR',
    organizationName: 'KESNNUR - Kenya Students & Novice Nurses',
    supportEmail: 'kesnnur@gmail.com',
    supportPhone: '+254791296924',
    websiteUrl: 'https://kesnnur.github.io/kesnnur', // Update with your actual URL
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, GITHUB_CONFIG, ADMIN_ROLES, APP_CONFIG };
}
