# Prince Negi — Portfolio OS

> An interactive personal portfolio designed as a retro macOS-style desktop operating system.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PriNce0P-Negi/portfolio)

---

## 🖥️ Live Demo

**[princenegi.dev](https://princenegi.dev)**

---

## ✨ What is this?

Instead of a traditional scrolling portfolio, this is a fully interactive **desktop operating system** built in vanilla HTML, CSS, and JavaScript.

Visitors can:
- Open and drag windows around the desktop
- Resize, minimize, and maximize each section
- Play a retro **Snake** game
- Play **Minesweeper**
- Explore my About, Projects, Skills, Likes, Goals, and Achievements in individual windows
- Open the Social Links folder like a real Finder window
- Experience a full **boot sequence** on first load

---

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML — all windows and structure
├── style.css           # All styles — theme, windows, dock, animations
├── app.js              # Window manager, boot sequence, clock, drag & resize
├── snake.js            # Snake game (canvas-based)
├── minesweeper.js      # Minesweeper game with flood-fill, timer, flagging
├── sw.js               # Service worker (PWA, offline support)
├── manifest.json       # PWA manifest
├── vercel.json         # Vercel deployment config + security headers
├── robots.txt          # Search engine directives
├── sitemap.xml         # XML sitemap for Google Search Console
├── favicon.svg         # SVG favicon (PN logo)
├── 404.html            # Custom 404 page (OS-themed error dialog)
├── Resume.pdf          # ← ADD YOUR RESUME HERE (placeholder for now)
├── icons/              # ← ADD PWA icons here (see icon requirements below)
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png    (180x180)
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── og-image.png            (1200x630 — social share preview)
└── .gitignore
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push this repository to GitHub.**
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo.
3. No build configuration needed. Vercel auto-detects this as a static site.
4. Click **Deploy**.

Every push to `main` automatically triggers a new deployment.

### Custom Domain

1. In Vercel dashboard → **Settings → Domains**.
2. Add `princenegi.dev`.
3. Update your domain DNS records as instructed by Vercel.
4. Done. HTTPS is automatic.

---

## 📊 Analytics Setup

### Google Analytics 4

1. Go to [analytics.google.com](https://analytics.google.com) → Create a new GA4 property.
2. Get your **Measurement ID** (format: `G-XXXXXXXXXX`).
3. Open `index.html`.
4. Find the comment block marked `GOOGLE ANALYTICS 4`.
5. Uncomment the script block and replace `G-XXXXXXXXXX` with your Measurement ID.

### Microsoft Clarity

1. Go to [clarity.microsoft.com](https://clarity.microsoft.com) → Create a new project.
2. Get your **Project ID**.
3. Open `index.html`.
4. Find the comment block marked `MICROSOFT CLARITY`.
5. Uncomment the script block and replace `XXXXXXXXXX` with your Project ID.

---

## 🔍 Google Search Console

1. Deploy the site first.
2. Go to [search.google.com/search-console](https://search.google.com/search-console).
3. Add property → **URL prefix** → enter `https://princenegi.dev`.
4. Verify ownership (HTML tag method is easiest — paste the meta tag into `index.html` inside the `<head>`).
5. Submit `https://princenegi.dev/sitemap.xml` under **Sitemaps**.

---

## 🖼️ Adding Icons (PWA + Favicon)

The `icons/` folder is required for PWA support and proper favicons.

**Quick setup using [realfavicongenerator.net](https://realfavicongenerator.net):**
1. Upload a square image of the **PN** logo (or any image you want as your icon).
2. Download the generated pack.
3. Place the PNG files in the `icons/` folder.
4. Also add `og-image.png` (1200×630px) — this is the image shown when sharing on LinkedIn, Twitter, WhatsApp, etc.

---

## 📄 Adding Your Resume

1. Export your resume as a PDF named exactly: `Resume.pdf`
2. Place it in the root of this project (same folder as `index.html`).
3. The "Resume.pdf" icon in the Social Links window will automatically serve the file.
   *(The resume notice modal will no longer appear once the file exists.)*

---

## 🛠 Customization

### Updating Your Info

All personal content is in `index.html`:

| Section | Window ID | What to edit |
|---|---|---|
| About | `#win-about` | Name, bio, contact details |
| Achievements | `#win-achievements` | Achievement cards |
| Projects | `#win-projects` | Project cards and links |
| Skills | `#win-skills` | Skill bars and percentages |
| Likes | `#win-likes` | Personal interests |
| Goals | `#win-goals` | Life goals |
| Social Links | `#win-social` | Social URLs and email |

### Version & Last Updated

In `index.html`, search for:
```html
<span class="about-meta-pill">Portfolio OS v1.0.0</span>
<span class="about-meta-pill">Last updated: July 2026</span>
```
Update these as you release new versions.

### Canonical URL & OG Image

In `index.html` `<head>`, update:
```html
<link rel="canonical" href="https://princenegi.dev" />
<meta property="og:url" content="https://princenegi.dev" />
<meta property="og:image" content="https://princenegi.dev/icons/og-image.png" />
```

---

## ⚡ Performance

This portfolio is optimized to target:

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 100 |
| Lighthouse SEO | 100 |

All animations respect `prefers-reduced-motion` for accessibility.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | Vanilla CSS3 (no frameworks) |
| Logic | Vanilla JavaScript (ES6+) |
| Games | HTML5 Canvas API |
| Fonts | Google Fonts (Inter, Roboto Mono, VT323) |
| PWA | Service Worker + Web App Manifest |
| Hosting | Vercel |
| Analytics | Google Analytics 4 + Microsoft Clarity |

---

## 📬 Contact

- **Email:** princenegi11179@gmail.com
- **GitHub:** [github.com/PriNce0P-Negi](https://github.com/PriNce0P-Negi)
- **LinkedIn:** [linkedin.com/in/prince-negi-94289a314](https://www.linkedin.com/in/prince-negi-94289a314/)
- **X:** [@_PRINCE_NEGI](https://x.com/_PRINCE_NEGI)
- **LeetCode:** [leetcode.com/u/Prince_Negi_](https://leetcode.com/u/Prince_Negi_/)

---

*Built with vanilla HTML, CSS, and JavaScript. No frameworks. No bundlers. Just code.*
