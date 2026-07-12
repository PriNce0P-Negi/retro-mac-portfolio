# icons/ — Required Assets

This folder must contain the following files before deploying.

## Required Files

| File | Size | Purpose |
|---|---|---|
| `favicon-16x16.png` | 16×16 | Browser tab favicon (small) |
| `favicon-32x32.png` | 32×32 | Browser tab favicon (standard) |
| `apple-touch-icon.png` | 180×180 | iOS home screen icon |
| `icon-72x72.png` | 72×72 | PWA icon |
| `icon-96x96.png` | 96×96 | PWA icon |
| `icon-128x128.png` | 128×128 | PWA icon |
| `icon-192x192.png` | 192×192 | PWA icon (required for installability) |
| `icon-512x512.png` | 512×512 | PWA splash screen icon |
| `og-image.png` | 1200×630 | Social media share preview image |

## How to Generate

**Easiest method — [realfavicongenerator.net](https://realfavicongenerator.net):**

1. Open the site.
2. Upload a square image of your PN logo (or any image).
3. Configure options and download the generated pack.
4. Place all the PNG files in this folder.

**For `og-image.png`:**
- Design a 1200×630 image in Canva, Figma, or any tool.
- Export as PNG and name it `og-image.png`.
- This is the image shown when you share your portfolio link on LinkedIn, Twitter/X, WhatsApp, etc.

## Notes

- The SVG favicon (`/favicon.svg`) is already created in the root and works in all modern browsers without needing PNG versions.
- PNG icons are needed for PWA installability and older browsers.
- Without these files the site still works perfectly — only PWA install prompts won't appear.
