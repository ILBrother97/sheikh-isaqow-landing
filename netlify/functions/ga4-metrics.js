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

    // Calculate date range (from September 10, 2024 to today)
    const startDate = '2024-09-10';
    const endDate = new Date().toISOString().split('T')[0]; // Today's date

    console.log('Fetching GA4 data for date range:', startDate, 'to', endDate);

    // Request for basic website metrics
    const basicMetricsRequest = {
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
          { name: 'activeUsers' },
          { name: 'totalUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' }
        ],
      },
    };

    // Request for download events (if they exist)
    const downloadEventsRequest = {
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
          { name: 'eventCount' }
        ],
        dimensions: [
          { name: 'eventName' }
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              matchType: 'CONTAINS',
              value: 'download',
              caseSensitive: false
            },
          },
        },
      },
    };

    // Execute requests
    console.log('Making GA4 API requests...');
    const [basicMetricsResponse, downloadEventsResponse] = await Promise.all([
      analyticsData.properties.runReport(basicMetricsRequest),
      analyticsData.properties.runReport(downloadEventsRequest).catch((error) => {
        console.log('Download events request failed (this is normal if no download events exist):', error.message);
        return null;
      }),
    ]);

    console.log('GA4 API responses received');

    // Extract basic metrics
    const basicData = basicMetricsResponse.data;
    const activeUsers = basicData.rows?.[0]?.metricValues?.[0]?.value || '0';
    const totalUsers = basicData.rows?.[0]?.metricValues?.[1]?.value || '0';
    const sessions = basicData.rows?.[0]?.metricValues?.[2]?.value || '0';
    const pageViews = basicData.rows?.[0]?.metricValues?.[3]?.value || '0';

    // Extract download events (if available)
    let downloadEvents = '0';
    if (downloadEventsResponse?.data?.rows) {
      downloadEvents = downloadEventsResponse.data.rows.reduce((total, row) => {
        return total + parseInt(row.metricValues[0].value || '0');
      }, 0).toString();
    }

    console.log('Extracted metrics:', {
      activeUsers,
      totalUsers,
      sessions,
      pageViews,
      downloadEvents
    });

    // Use a combination of metrics for "downloads" - could be sessions, page views, or actual download events
    const downloads = downloadEvents !== '0' ? downloadEvents : sessions;

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

    console.log('Formatted results:', {
      formattedActiveUsers,
      formattedDownloads,
      dateRange: { startDate, endDate }
    });

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
          totalUsers: parseInt(totalUsers),
          sessions: parseInt(sessions),
          pageViews: parseInt(pageViews),
          downloadEvents: parseInt(downloadEvents),
          downloads: parseInt(downloads),
        },
        success: true,
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
