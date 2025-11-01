const fetch = require('node-fetch');
const { GoogleAuth } = require('google-auth-library');

exports.handler = async function(event, context) {
  const GA4_PROPERTY_ID = '510252078'; // Your GA4 property ID
  const GA4_CREDENTIALS = process.env.GA4_CREDENTIALS; // Service account JSON from Netlify env
  
  if (!GA4_CREDENTIALS) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'GA4_CREDENTIALS not configured',
        downloads: '1,200+',
        activeUsers: '850+'
      })
    };
  }

  try {
    // Parse service account credentials
    const credentials = JSON.parse(GA4_CREDENTIALS);
    
    // Use Google Auth Library for proper authentication
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });
    
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    const access_token = accessToken.token;
    
    // Fetch downloads (apk_download event count)
    const downloadsResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '2025-09-01', endDate: 'today' }],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { 
                matchType: 'EXACT',
                value: 'apk_download'
              }
            }
          }
        })
      }
    );
    
    // Fetch active users (last 30 days)
    const usersResponse = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [{ name: 'activeUsers' }]
        })
      }
    );
    
    const downloadsData = await downloadsResponse.json();
    const usersData = await usersResponse.json();
    
    // Log responses for debugging
    console.log('Downloads response:', JSON.stringify(downloadsData, null, 2));
    console.log('Users response:', JSON.stringify(usersData, null, 2));
    console.log('Downloads rows count:', downloadsData.rows?.length || 0);
    console.log('Users rows count:', usersData.rows?.length || 0);
    
    // Extract values with better error handling
    let downloads = '0';
    let activeUsers = '0';
    
    // Check if downloads response has data
    if (downloadsData.rows && downloadsData.rows.length > 0) {
      downloads = downloadsData.rows[0].metricValues?.[0]?.value || '0';
    } else if (downloadsData.error) {
      console.error('Downloads API error:', downloadsData.error);
    }
    
    // Check if users response has data
    if (usersData.rows && usersData.rows.length > 0) {
      activeUsers = usersData.rows[0].metricValues?.[0]?.value || '0';
    } else if (usersData.error) {
      console.error('Users API error:', usersData.error);
    }
    
    // Format numbers with commas
    const formatNumber = (num) => {
      const n = parseInt(num);
      if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k+';
      return n.toLocaleString() + '+';
    };
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: JSON.stringify({
        downloads: formatNumber(downloads),
        activeUsers: formatNumber(activeUsers),
        lastUpdated: new Date().toISOString()
      })
    };
    
  } catch (error) {
    console.error('GA4 API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        downloads: '1,200+',
        activeUsers: '850+'
      })
    };
  }
};
