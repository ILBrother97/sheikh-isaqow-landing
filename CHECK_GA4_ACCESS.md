# How to Verify GA4 Access and Data

## Step 1: Check if GA4 Has Any Data

1. Go to: https://analytics.google.com/
2. Select your property: **Sheikh Isaqow Hassan Bora** (G-J2P77ELRJ1)
3. Go to **Reports** → **Realtime**
4. Check if you see ANY activity (users, events, etc.)

**If you see data**: Service account might not have access (go to Step 2)
**If you see NO data**: GA4 hasn't collected anything yet (go to Step 3)

---

## Step 2: Verify Service Account Access

1. In GA4, click **Admin** (gear icon, bottom-left)
2. Under **Property** column → **Property Access Management**
3. Look for your service account email (from the JSON file):
   - Format: `netlify-ga4-reader@PROJECT_ID.iam.gserviceaccount.com`
4. **Check if it's listed** with "Viewer" role

### If NOT listed:
1. Click **"+"** (Add users)
2. Paste the service account email
3. Select role: **Viewer**
4. Uncheck "Notify new users by email"
5. Click **Add**
6. Wait 5 minutes, then test again

---

## Step 3: Check for APK Download Events

1. In GA4, go to **Reports** → **Engagement** → **Events**
2. Look for event: **`apk_download`**
3. Check the count

### If you see `apk_download` events:
- The function should show this count
- If it shows "0+", there's a permissions issue (go back to Step 2)

### If you DON'T see `apk_download` events:
- No one has downloaded the APK yet
- OR the tracking code isn't firing
- Test by clicking the download button yourself

---

## Step 4: Test APK Download Tracking

1. Visit your live site: https://sheikh-isaqow-hassan-bora.netlify.app/
2. Open browser DevTools → Console
3. Click the **"Direct APK Download"** button
4. Check console for: `apk_download` event logged
5. Wait 5-10 minutes
6. Go back to GA4 → Reports → Realtime
7. Look for the `apk_download` event

---

## Step 5: Check Active Users

1. In GA4, go to **Reports** → **Realtime**
2. Check **"Users in the last 30 minutes"**
3. If you see users, GA4 is tracking

Then check:
1. **Reports** → **Life cycle** → **Engagement** → **Overview**
2. Look at **Active users** (last 7 days, 28 days)

### If you see active users:
- The function should show this count
- If it shows "0+", there's a permissions issue

### If you see NO active users:
- Your site hasn't had visitors yet
- OR GA4 tracking isn't working

---

## Step 6: Verify GA4 Tracking Code

Check if GA4 is installed on your landing page:

1. Visit: https://sheikh-isaqow-hassan-bora.netlify.app/
2. Open DevTools → Network tab
3. Filter by: `google-analytics` or `gtag`
4. Reload the page
5. Look for requests to: `https://www.google-analytics.com/g/collect`

**If you see these requests**: GA4 is working ✅
**If you DON'T see them**: GA4 code is missing or blocked ❌

---

## Quick Diagnostic: Test the Function with Debug

You can check what the function is actually receiving from GA4:

1. Go to Netlify: https://app.netlify.com/sites/sheikh-isaqow-hassan-bora/functions
2. Click on **metrics** function
3. Click **Function log**
4. Visit your site to trigger the function
5. Check logs for any error messages

---

## Most Likely Scenarios:

### Scenario A: "0+" is correct
- Your app just launched
- No downloads or visitors yet
- **Solution**: Wait for real traffic, metrics will update automatically

### Scenario B: Service account not added
- You created the service account but forgot to add it to GA4
- **Solution**: Follow Step 2 above

### Scenario C: GA4 has data but function shows 0
- Service account doesn't have proper permissions
- **Solution**: Remove and re-add service account with "Viewer" role

### Scenario D: GA4 tracking not working
- No data in GA4 at all
- **Solution**: Check if GA4 tracking code is on your site (Step 6)

---

## Expected Results After Fix:

Once everything is working, the function should return something like:
```json
{
  "downloads": "45+",
  "activeUsers": "23+",
  "lastUpdated": "2025-11-01T..."
}
```

And your site metrics will update automatically every hour!
