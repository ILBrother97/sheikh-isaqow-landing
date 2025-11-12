const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // GA4 Property ID
    const propertyId = '510252078';
    
    // Parse GA4 credentials from environment variable
    let credentials;
    try {
      if (process.env.GA4_CREDENTIALS) {
        // If using single JSON credential
        credentials = JSON.parse(process.env.GA4_CREDENTIALS);
      } else {
        // If using separate environment variables
        credentials = {
          type: 'service_account',
          project_id: process.env.GA4_PROJECT_ID,
          private_key_id: process.env.GA4_PRIVATE_KEY_ID,
          private_key: process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.GA4_CLIENT_EMAIL,
          client_id: process.env.GA4_CLIENT_ID,
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: process.env.GA4_CLIENT_CERT_URL,
        };
      }
    } catch (error) {
      throw new Error(`Failed to parse GA4 credentials: ${error.message}`);
    }

    // Initialize Google Analytics Data API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analyticsData = google.analyticsdata('v1beta');

    // Calculate date range (from September 10, 2025 to today)
    const startDate = '2024-09-10'; // Assuming you meant 2024, not 2025
    const endDate = new Date().toISOString().split('T')[0]; // Today's date

    // Request for total users (active users)
    const activeUsersRequest = {
      auth,
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: startDate,
            endDate: endDate,
          },
        ],
        metrics: [
          {
            name: 'activeUsers',
          },
        ],
      },
    };

    // Request for custom events (downloads)
    const downloadsRequest = {
      auth,
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [
          {
            startDate: startDate,
            endDate: endDate,
          },
        ],
        metrics: [
          {
            name: 'eventCount',
          },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'EXACT',
              value: 'download_app', // Custom event for app downloads
            },
          },
        },
      },
    };

    // Execute requests
    const [activeUsersResponse, downloadsResponse] = await Promise.all([
      analyticsData.properties.runReport(activeUsersRequest),
      analyticsData.properties.runReport(downloadsRequest).catch(() => null), // Don't fail if download events don't exist
    ]);

    // Extract data
    const activeUsers = activeUsersResponse.data.rows?.[0]?.metricValues?.[0]?.value || '0';
    const downloads = downloadsResponse?.data.rows?.[0]?.metricValues?.[0]?.value || '0';

    // Format numbers
    const formatNumber = (num) => {
      const number = parseInt(num);
      if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}k+`;
      }
      return `${number}+`;
    };

    const formattedActiveUsers = formatNumber(activeUsers);
    const formattedDownloads = formatNumber(downloads);

    // Return formatted data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        activeUsers: formattedActiveUsers,
        downloads: formattedDownloads,
        lastUpdated: new Date().toISOString(),
        dateRange: {
          startDate,
          endDate,
        },
        rawData: {
          activeUsers: parseInt(activeUsers),
          downloads: parseInt(downloads),
        },
      }),
    };

  } catch (error) {
    console.error('GA4 API Error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      hasCredentials: !!process.env.GA4_CREDENTIALS,
      propertyId: '510252078'
    });
    
    // Return fallback data on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        activeUsers: '839+',
        downloads: '1.3k+',
        lastUpdated: new Date().toISOString(),
        error: `GA4 API failed: ${error.message}`,
        fallback: true,
        dateRange: {
          startDate: '2024-09-10',
          endDate: new Date().toISOString().split('T')[0],
        },
      }),
    };
  }
};
