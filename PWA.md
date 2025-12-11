# PWA Features

## Installation

The NSUT Placement Tracker is now a Progressive Web App (PWA) that can be installed on your device!

### Desktop Installation

**Chrome/Edge:**
1. Visit the website
2. Look for the install icon in the address bar
3. Click "Install" when prompted
4. The app will open in its own window

**Safari (macOS):**
1. Visit the website
2. Click File → Add to Dock
3. The app will appear in your Dock

### Mobile Installation

**Android (Chrome):**
1. Visit the website
2. Tap the menu (⋮) button
3. Select "Add to Home screen" or "Install app"
4. Tap "Install" when prompted

**iOS (Safari):**
1. Visit the website
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

## PWA Features

### ✅ Installable
- Install as a standalone app on any device
- Works on desktop and mobile
- App-like experience without browser UI

### ✅ Offline Support
- Service worker caches essential files
- Browse cached data when offline
- Network-first strategy for fresh data

### ✅ Fast Loading
- Assets cached for instant loading
- Background updates for new content
- Optimized for performance

### ✅ Responsive
- Mobile-friendly interface
- Touch-optimized controls
- Works on all screen sizes

### ✅ Auto-Updates
- Automatic update notifications
- One-click update to latest version
- Seamless background updates

## Technical Details

### Service Worker Strategy
- **Static Assets**: Precached (JS, CSS, HTML, images)
- **API Calls**: Network-first with 5-minute cache fallback
- **Runtime Caching**: Intelligent caching for better performance

### Cache Management
- Companies API: 50 entries, 5-minute expiration
- Stats API: 20 entries, 5-minute expiration
- Auto-cleanup of old cache entries

### Manifest Configuration
- **Name**: NSUT Placement Tracker
- **Short Name**: T&P Tracker
- **Theme Color**: #0a0a0a (black)
- **Background Color**: #ffffff (white)
- **Display**: Standalone
- **Orientation**: Portrait

## Development

### Local Development with PWA
```bash
cd "e:\NSUT Placements\Frontend\NSUT Placement Stats"
npm run dev
```

PWA features are enabled in development mode for testing.

### Building for Production
```bash
npm run build
```

This generates:
- Optimized production build
- Service worker file
- Web manifest
- PWA icons

### Generating Icons
Icons are automatically generated from `public/mask-icon.svg`:

```bash
node generate-icons.mjs
```

Generates:
- `pwa-192x192.png` - Standard PWA icon
- `pwa-512x512.png` - High-res PWA icon
- `apple-touch-icon.png` - iOS home screen icon

## Browser Support

| Browser | Install | Offline | Notifications |
|---------|---------|---------|--------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ❌ |
| Safari (macOS) | ✅ | ✅ | ❌ |
| Firefox | ⚠️ Limited | ✅ | ✅ |

## Troubleshooting

### Install Button Not Showing
- PWA criteria must be met (HTTPS, manifest, service worker)
- App may already be installed
- Try in incognito/private mode

### Offline Mode Not Working
- First visit must be online to cache assets
- Check service worker registration in DevTools
- Clear cache and reload if issues persist

### Icons Not Displaying
- Ensure icons exist in `public/` folder
- Run `node generate-icons.mjs` to regenerate
- Clear browser cache

### Update Not Showing
- Hard refresh the page (Ctrl+Shift+R)
- Unregister service worker in DevTools
- Reinstall the app

## Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check:
   - Manifest
   - Service Workers
   - Cache Storage
   - Install prompts

### Lighthouse Audit
1. Open DevTools
2. Go to "Lighthouse" tab
3. Select "Progressive Web App"
4. Click "Analyze page load"

Should score 100/100 for PWA criteria.

## Deployment with PWA

All deployment platforms automatically serve the PWA:

**Vercel/Netlify:**
- Automatically serves manifest and service worker
- HTTPS enabled by default
- No additional configuration needed

**Custom Server:**
- Ensure HTTPS is enabled
- Serve manifest.webmanifest with correct MIME type
- Service worker must be at root or use scope parameter

## Future Enhancements

- [ ] Push notifications for company updates
- [ ] Background sync for offline changes
- [ ] Share target API for sharing companies
- [ ] File handling for import/export
- [ ] Periodic background sync
