# Sheikh Isaqow Hassan Bora — Official Landing Page

[![Netlify Status](https://api.netlify.com/api/v1/badges/placeholder/deploy-status)](https://sheikh-isaqow-hassan-bora.netlify.app)
![GitHub last commit](https://img.shields.io/github/last-commit/ILBrother97/sheikh-isaqow-landing)

**Live site:** [sheikh-isaqow-hassan-bora.netlify.app](https://sheikh-isaqow-hassan-bora.netlify.app)

Single-page marketing site for the Android app (package `com.shkisaqowhassanbora`). Built with vanilla HTML, CSS, and JavaScript. Performance-optimized, SEO-ready, mobile-friendly, and deployed via Netlify.

---

## Features

- **Hero section** — floating profile image, animated badge, gradient CTA buttons
- **Authority section** — biography with Islamic geometric pattern background
- **App features** — card grid with icons, screenshots, and hover transitions
- **Screenshot carousel** — showcases the app UI across three devices
- **Download section** — links to Google Play, Uptodown, APKPure, and direct APK
- **Footer** — app details, social links, privacy/terms, and copyright
- **Additional pages** — About, FAQ, Contact, Terms, Privacy, Thank You
- **Dark theme** — warm gold/amber color palette with purple accent tones
- **WebP images** — modern image format for faster loading
- **Google Analytics** — tracking via G-XXXXXXXXXX
- **Structured data** — JSON-LD for rich search results
- **Verified badge** — PRO verification badge on the hero card

---

## Project Structure

```
/
├── index.html                  # Main landing page
├── about.html                  # About page
├── contact.html                # Contact page
├── faq.html                    # Frequently asked questions
├── terms.html                  # Terms of service
├── privacy.html                # Privacy policy
├── thank-you.html              # Post-download thank you page
├── download-sources.html       # Alternative download sources
│
├── assets/
│   ├── images/
│   │   ├── sheikh-profile.webp       # Hero profile image
│   │   ├── logo.webp                 # Header logo
│   │   ├── logo-no-circle-min.webp   # Minimal logo variant
│   │   ├── screenshot-*.png          # App screenshots
│   │   ├── apkpure_logo.webp         # APKPure store logo
│   │   └── apkcom_logo.webp          # APKCombo store logo
│   │
│   ├── favicon/
│   │   ├── favicon.ico               # Legacy favicon
│   │   ├── favicon.svg               # Scalable favicon
│   │   ├── favicon.webp              # Modern favicon
│   │   ├── favicon-96x96.webp        # 96px favicon
│   │   ├── apple-touch-icon.webp     # iOS home screen icon
│   │   ├── web-app-manifest-192x192.webp
│   │   ├── web-app-manifest-512x512.webp
│   │   └── site.webmanifest          # PWA web manifest
│   │
│   ├── fonts/
│   │   ├── Cormorant-Bold.ttf
│   │   └── CormorantSC-SemiBold.ttf
│   │
│   └── apk/
│       └── SheikhIsaqowApp-v1.0.5.apk
│
├── css/
│   ├── style.css              # Primary stylesheet
│   ├── about.css               # About page styles
│   └── contact.css             # Contact page styles
│
├── js/
│   └── script.js               # Site interactions and carousel
│
├── photos/                     # Source/raw images (not served)
├── AGENTS.md                   # Project instructions for AI coding
├── .gitignore
├── README.md
└── robots.txt
```

---

## Tech Stack

| Technology       | Purpose                      |
|------------------|------------------------------|
| HTML5            | Structure and semantic markup |
| CSS3             | Custom styles, animations, gradients |
| Vanilla JS       | Carousel, interactions, UI |
| Netlify          | Hosting and continuous deployment |
| Google Analytics | Visitor tracking |
| schema.org       | Structured data for rich search results |
| WebP             | Optimized image format |

---

## Development

### Prerequisites

- A text editor (VS Code recommended)
- Git for version control
- Netlify account (for deployment)

### Local Development

Simply open any `.html` file in your browser. No build step required.

```bash
# Clone the repo
git clone https://github.com/ILBrother97/sheikh-isaqow-landing.git

# Open in browser
start index.html
```

### Making Changes

1. Edit HTML files in the root directory
2. Edit styles in `css/style.css`
3. Edit scripts in `js/script.js`
4. Refresh the browser to see changes

---

## Deployment

### Netlify (recommended)

1. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
2. Go to [app.netlify.com](https://app.netlify.com) → New site from Git → pick your repo
3. Build settings:
   - Build command: *(leave empty)*
   - Publish directory: `/`
4. Deploy. Netlify auto-deploys on every push.

### Deploy from drag & drop

Drag the project folder into [Netlify Deploys](https://app.netlify.com/drop).

---

## SEO & Social

- **Google Search Console** — verify your domain and submit the sitemap
- **Open Graph** — update `og:image` and `og:url` in each HTML `<head>` to your domain
- **Twitter Cards** — update `twitter:image` and `twitter:url`
- **Structured data** — JSON-LD in `index.html` for SoftwareApplication schema
- **Robots.txt** — included at root
- **Sitemap** — recommended: add `sitemap.xml` and submit to Search Console

To update the Google Search favicon, go to **Search Console → Settings → Favicon** and request validation.

---

## Updating the APK

1. Place the signed APK at `assets/apk/SheikhIsaqowApp-v1.0.5.apk`
2. Update the version number in `index.html` download links and JSON-LD
3. Commit and push → Netlify auto-deploys

---

## Image Optimization

All favicon images are served as **WebP** for smaller file sizes and faster loading. Original PNG source files are kept in the `photos/` directory (not served in production).

To convert more images to WebP:

```bash
ffmpeg -i input.png -quality 80 output.webp
```

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Android Chrome
- iOS Safari

---

## License

All rights reserved. This project is the official landing page for the Sheikh Isaqow Hassan Bora Android application.

---

## Contact

**Developer:** IlBrother — [isackdev.vercel.app](https://isackdev.vercel.app/)  
**App package:** `com.shkisaqowhassanbora`  
**Live site:** [sheikh-isaqow-hassan-bora.netlify.app](https://sheikh-isaqow-hassan-bora.netlify.app)
