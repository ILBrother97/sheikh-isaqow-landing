# Setup Guide: GA4 API for Real-Time Metrics

## What I Created

✅ **Netlify Function**: `netlify/functions/metrics.js` - Fetches live data from GA4
✅ **Frontend Integration**: `index.html` - Calls the function and displays metrics
✅ **Dependencies**: `netlify/functions/package.json` - Required npm packages

## Setup Steps (15 minutes)

### Step 1: Enable Google Analytics Data API

1. Go to: <https://console.cloud.google.com/>
2. Select your existing project OR create new: **"Sheikh Isaqow Analytics"**
3. Click **"Enable APIs and Services"**
4. Search for: **"Google Analytics Data API"**
5. Click **Enable**

### Step 2: Create Service Account

1. In Google Cloud Console → **IAM & Admin** → **Service Accounts**
2. Click **"Create Service Account"**
3. Name: `netlify-ga4-reader`
4. Description: `Read-only access to GA4 for landing page metrics`
5. Click **Create and Continue**
6. Grant role: **Viewer** (or skip, we'll add in GA4)
7. Click **Done**

### Step 3: Generate Service Account Key

1. Click on the service account you just created
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Choose **JSON** format
5. Click **Create** - a JSON file will download
6. **Keep this file safe!** You'll need it in Step 5

### Step 4: Grant GA4 Access to Service Account

1. Open Google Analytics: <https://analytics.google.com/>
2. Go to **Admin** (bottom-left gear icon)
3. Under **Property** → **Property Access Management**
4. Click **"+"** (Add users)
5. Paste the service account email from the JSON file (looks like: `netlify-ga4-reader@PROJECT_ID.iam.gserviceaccount.com`)
6. Select role: **Viewer**
7. Uncheck **"Notify new users by email"**
8. Click **Add**

### Step 5: Add Credentials to Netlify

1. Open the downloaded JSON file in a text editor
2. Copy the **entire contents** of the file
3. Go to Netlify: <https://app.netlify.com/>
4. Select your site: **sheikh-isaqow-hassan-bora**
5. Go to **Site settings** → **Environment variables**
6. Click **Add a variable**
7. Key: `GA4_CREDENTIALS`
8. Value: Paste the entire JSON content
9. Click **Create variable**

### Step 6: Deploy

```powershell
git add netlify/ index.html SETUP_GA4_API.md
git commit -m "Add Netlify Function for real-time GA4 metrics"
git push
```

### Step 7: Test

1. Wait for Netlify deployment to complete (1-2 minutes)
2. Visit your live site: <https://sheikh-isaqow-hassan-bora.netlify.app/>
3. Open browser DevTools → Console
4. Look for: `Metrics updated: [timestamp]`
5. Check the metrics band - numbers should update from GA4!

## How It Works

1. **User visits page** → JavaScript calls `/.netlify/functions/metrics`
2. **Netlify Function** → Authenticates with GA4 using service account
3. **GA4 API** → Returns:
   - Total `apk_download` events (all time)
   - Active users (last 30 days)
4. **Function formats** → Returns clean numbers (e.g., "1.2k+")
5. **Frontend displays** → Updates metrics cards
6. **Cached for 1 hour** → Reduces API calls

## Troubleshooting

### "GA4_CREDENTIALS not configured"
- Check Netlify environment variable is set correctly
- Redeploy after adding the variable

### "Failed to fetch metrics"
- Check browser console for detailed error
- Verify service account has Viewer access in GA4
- Confirm GA4 Data API is enabled in Google Cloud

### Numbers show "—" or fallback values
- Open browser DevTools → Network tab
- Check if `metrics` function returns 200 status
- Look at response body for error messages

### "Invalid credentials"
- Ensure JSON was copied completely (no truncation)
- Check service account email matches what's in GA4

## What Gets Tracked

- **Total downloads**: Count of `apk_download` events from Jan 1, 2024 to today
- **Active users**: Unique users in last 30 days
- **Auto-refresh**: Metrics update every hour (cached)

## Security

✅ Service account has **read-only** access
✅ Credentials stored securely in Netlify environment
✅ Not exposed in frontend code
✅ Function runs server-side only

## Next Steps

Once deployed and working:
- Metrics will auto-update every hour
- No manual intervention needed
- Check Netlify Function logs if issues arise
