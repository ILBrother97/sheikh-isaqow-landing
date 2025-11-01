# Google Analytics 4 Real-Time Metrics Setup

## Current Status

✅ **Lectures curated**: 852 (hardcoded - static value)
⚠️ **Total downloads**: Using fallback value (1,200+)
⚠️ **Active users**: Using fallback value (850+)

## Option 1: Manual Updates (Simplest)

Update the fallback values in `index.html` (lines 950-951) whenever you check GA4:

```javascript
const fallbackDownloads = '1,200+'; // Update this manually
const fallbackUsers = '850+';       // Update this manually
```

**How to get real numbers from GA4:**
1. Go to https://analytics.google.com/
2. Select your property (G-J2P77ELRJ1)
3. **For Downloads**: Reports → Engagement → Events → Filter by `apk_download` → View total count
4. **For Active Users**: Reports → Realtime → Active users in last 30 days

---

## Option 2: Backend API (Recommended for Auto-Updates)

### Step 1: Create a Netlify Function

Create file: `netlify/functions/metrics.js`

```javascript
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const GA4_PROPERTY_ID = '440648046'; // Your property ID
  const GA4_API_SECRET = process.env.GA4_API_SECRET; // Set in Netlify env vars
  
  try {
    // Fetch from GA4 Data API
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GA4_API_SECRET}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [
            { name: 'eventCount' },
            { name: 'activeUsers' }
          ],
          dimensions: [{ name: 'eventName' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              stringFilter: { value: 'apk_download' }
            }
          }
        })
      }
    );
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        downloads: data.rows?.[0]?.metricValues?.[0]?.value || '0',
        activeUsers: data.rows?.[0]?.metricValues?.[1]?.value || '0'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch metrics' })
    };
  }
};
```

### Step 2: Enable GA4 Data API

1. Go to https://console.cloud.google.com/
2. Select your project or create new one
3. Enable **Google Analytics Data API**
4. Create **Service Account** credentials
5. Download JSON key file
6. In GA4, add service account email to property with "Viewer" role

### Step 3: Set Netlify Environment Variable

1. Netlify dashboard → Site settings → Environment variables
2. Add: `GA4_API_SECRET` = (your service account key content)

### Step 4: Update index.html

Uncomment lines 954-963 in `index.html`:

```javascript
try {
  const response = await fetch('/.netlify/functions/metrics');
  const data = await response.json();
  document.getElementById('metric-downloads').textContent = data.downloads;
  document.getElementById('metric-users').textContent = data.activeUsers;
} catch (error) {
  console.error('Failed to fetch metrics:', error);
  document.getElementById('metric-downloads').textContent = fallbackDownloads;
  document.getElementById('metric-users').textContent = fallbackUsers;
}
```

---

## Option 3: Simple JSON File (Quick Alternative)

Create `metrics.json` in your repo:

```json
{
  "downloads": "1,200+",
  "activeUsers": "850+"
}
```

Update manually and commit when numbers change. Then fetch it:

```javascript
try {
  const response = await fetch('/metrics.json');
  const data = await response.json();
  document.getElementById('metric-downloads').textContent = data.downloads;
  document.getElementById('metric-users').textContent = data.activeUsers;
} catch (error) {
  // Use fallback
}
```

---

## Recommendation

**For now**: Use **Option 1** (manual updates) - simplest and works immediately.

**For production**: Implement **Option 2** (Netlify Function + GA4 API) for automatic real-time updates.

**Quick middle ground**: Use **Option 3** (JSON file) - easy to update, no API setup needed.

---

## Current Fallback Values

Update these in `index.html` based on your actual GA4 data:
- Downloads: 1,200+ (placeholder)
- Active Users: 850+ (placeholder)
- Lectures: 852 (confirmed real)
