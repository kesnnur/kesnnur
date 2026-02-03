// Supabase Configuration
const SUPABASE_CONFIG = {
    url: 'https://noadhwqvaxajuckpibbo.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWRod3F2YXhhanVja3BpYmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDk0MDEsImV4cCI6MjA4NTY4NTQwMX0.tFqnonlgPjmcgC5KOiSriISFFE5FbdBrsVzsxURrbAw'
};

// Admin Roles
const ADMIN_ROLES = ['chapter_admin', 'national_admin', 'super_admin'];

// App Constants
const APP_CONFIG = {
    appName: 'KESNNUR Admin',
    organizationName: 'KESNNUR',
    supportEmail: 'kesnnur@gmail.com',
    supportPhone: '+254791296924'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, ADMIN_ROLES, APP_CONFIG };
}
