# Formspree Setup Guide

## Step 1: Create a Formspree Account

1. Go to https://formspree.io/
2. Click **Sign Up** (free tier: 50 submissions/month)
3. Use your email: **testingmany12@gmail.com**

## Step 2: Create a New Form

1. After login, click **+ New Project** or **+ New Form**
2. Give it a name: `Sheikh Isaqow Feedback`
3. Formspree will generate a **Form ID** (looks like: `myzygpqr`)

## Step 3: Configure Email Notifications

1. In your form settings, verify your email address
2. Enable **Email Notifications** (this is ON by default)
3. You'll receive feedback at: **testingmany12@gmail.com**

## Step 4: Update Your Website Code

Open `index.html` and find line **783**:

```javascript
const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_FORM_ID';
```

Replace `YOUR_FORMSPREE_FORM_ID` with your actual Form ID:

```javascript
const FORMSPREE_ENDPOINT = 'myzygpqr'; // Your actual ID from Formspree
```

## Step 5: Deploy and Test

1. Save the file
2. Deploy to Netlify:
   ```powershell
   git add index.html FORMSPREE_SETUP.md
   git commit -m "Add Formspree email notifications for feedback"
   git push
   ```
3. Wait for Netlify to deploy
4. Test the feedback button on your live site
5. Check your email inbox for the feedback notification

## What You'll Receive

Each feedback submission will email you:
- **Sentiment**: "positive" or "help"
- **Notes**: User's optional text
- **Page**: URL where feedback was submitted
- **Timestamp**: When it was submitted

## Formspree Dashboard

View all submissions in your Formspree dashboard:
- https://formspree.io/forms

## Troubleshooting

- **Not receiving emails?** Check spam folder and verify email in Formspree settings
- **Form not working?** Ensure Form ID is correct and has no extra spaces/quotes
- **Hit submission limit?** Upgrade to paid plan or wait for monthly reset
