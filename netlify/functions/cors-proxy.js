// netlify/functions/cors-proxy.js
exports.handler = async function(event, context) {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    
    const url = event.queryStringParameters.url;
    
    if (!url) {
        return { statusCode: 400, body: 'URL parameter is required' };
    }
    
    try {
        const response = await fetch(url, {
            headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWRod3F2YXhhanVja3BpYmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NzcyNzksImV4cCI6MjAyNTA1MzI3OX0.LP02egT5dJQkzvkxz5wETyQ_vZkdcxxz',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vYWRod3F2YXhhanVja3BpYmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk0NzcyNzksImV4cCI6MjAyNTA1MzI3OX0.LP02egT5dJQkzvkxz5wETyQ_vZkdcxxz'
            }
        });
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
