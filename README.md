Live site: https://sheikh-isaqow-hassan-bora.netlify.app
# Sheikh Isaqow Hassan Bora — Official Landing Page

Single-page site for the Android app (package `com.shkisaqowhassanbora`). Built with TailwindCSS (CDN). Mobile-friendly and Netlify-ready.

## Structure
```
/
├── index.html
├── assets/
│   ├── images/ (icon.png, screenshots)
│   └── apk/ (SheikhIsaqowApp-v1.0.2.apk)
└── css/ (optional)
```

## Edit links
Update `index.html` download links:
- Uptodown: `https://UPTODOWN_LINK`
- APKPure: `https://APKPURE_LINK`
- Google Play: `https://PLAY_STORE_LINK`
- Direct APK: `/assets/apk/SheikhIsaqowApp-v1.0.2.apk`

SEO: Set `YOUR_DOMAIN` in Open Graph/Twitter image and URL tags. Adjust `<title>`, meta description, and keywords.

## Deploy on GitHub Pages
1. Create a new repo on GitHub, e.g., `sheikh-isaqow-landing`.
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Initial landing page"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sheikh-isaqow-landing.git
   git push -u origin main
   ```
3. GitHub repo → Settings → Pages → Source: `Deploy from a branch` → Branch: `main` → `/root`.
4. Wait 1–3 minutes: `https://<your-username>.github.io/sheikh-isaqow-landing/`.

## Deploy on Netlify (from GitHub)
1. Go to https://app.netlify.com → New site from Git → pick your repo.
2. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
3. Deploy. Netlify will assign a URL like `https://your-site-name.netlify.app`.
4. Optional: set custom domain + HTTPS.

### Drag-and-drop deploy
- Alternatively, drag the `landing-site` folder into Netlify Deploys.

## Upload the APK
- Put your signed APK here: `assets/apk/SheikhIsaqowApp-v1.0.2.apk`.
- Commit and push; Netlify will redeploy.
- The "Direct APK Download" button will point to `https://YOUR_DOMAIN/assets/apk/SheikhIsaqowApp-v1.0.2.apk`.

## Privacy Policy
- If you place `privacy-policy.html` at project root (same level as `index.html`), the footer link will work automatically.

## Notes
- Tailwind is via CDN; no build step required.
- Replace `assets/images/screenshot-*.png` with real screenshots (1080×1920+).
- Keep images optimized for fast loading.
