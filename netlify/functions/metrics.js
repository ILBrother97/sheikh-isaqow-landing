const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const GA4_PROPERTY_ID = '440648046'; // Your GA4 property ID
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
    
    // Get OAuth2 access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await createJWT(credentials)
      })
    });
    
    const { access_token } = await tokenResponse.json();
    
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
    
    // Extract values
    const downloads = downloadsData.rows?.[0]?.metricValues?.[0]?.value || '0';
    const activeUsers = usersData.rows?.[0]?.metricValues?.[0]?.value || '0';
    
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

// Helper function to create JWT for service account authentication
async function createJWT(credentials) {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
    kid: credentials.private_key_id
  };
  
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };
  
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedClaim = base64url(JSON.stringify(claim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;
  
  // Sign with private key
  const crypto = require('crypto');
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(credentials.private_key, 'base64');
  const encodedSignature = base64url(signature);
  
  return `${signatureInput}.${encodedSignature}`;
}

function base64url(input) {
  const base64 = Buffer.from(input).toString('base64');
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
