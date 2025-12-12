# T&P Tracker 📊

A Progressive Web App (PWA) for tracking and managing NSUT placement companies and coordinator assignments.

## ✨ Features

- 📱 **Progressive Web App** - Install on any device, works offline
- 🎯 **Company Management** - Track 600+ placement opportunities
- 👥 **Coordinator Assignment** - Self-assign and manage companies
- 📊 **Performance Dashboard** - Monitor coordinator progress
- 🔄 **Status Tracking** - Tracked, Invited, Called toggles
- 🔍 **Sorting & Filtering** - Sort by multiple columns
- 📄 **Pagination** - View 50, 100, 150, or 300 companies per page
- 🎨 **Minimalist Design** - Clean black & white interface
- 📱 **Mobile Responsive** - Optimized for all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Backend API running (see main README)

### Installation

```bash
cd "e:\NSUT Placements\Frontend\NSUT Placement Stats"
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📱 PWA Installation

The app can be installed on any device for a native-like experience:

### Desktop (Chrome/Edge)
1. Visit the website
2. Click the install icon in address bar
3. Click "Install"

### Mobile (Android)
1. Open in Chrome
2. Tap menu → "Add to Home screen"
3. Tap "Install"

### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"

See [PWA.md](./PWA.md) for detailed PWA documentation.

## 🛠️ Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool & dev server
- **vite-plugin-pwa** - PWA support with Workbox
- **CSS3** - Styling with mobile-first responsive design

## 📁 Project Structure

```
src/
├── App.jsx              # Main component with table view
├── App.css              # Styling with responsive media queries
├── Performance.jsx      # Coordinator performance dashboard
├── Performance.css      # Performance page styles
├── InstallPWA.jsx       # PWA install prompt component
├── InstallPWA.css       # Install prompt styles
├── main.jsx             # Entry point with service worker registration
└── index.css            # Global styles

public/
├── pwa-192x192.png      # PWA icon (192x192)
├── pwa-512x512.png      # PWA icon (512x512)
├── apple-touch-icon.png # iOS home screen icon
└── mask-icon.svg        # Safari pinned tab icon
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

For production, create `.env.production`:
```env
VITE_API_URL=https://your-backend-url.com
```

### PWA Configuration

Edit `vite.config.js` to customize:
- App name and description
- Theme colors
- Icons
- Caching strategy
- Offline behavior

## 📦 Building

### Generate Icons

```bash
npm run generate-icons
```

Generates PWA icons from `public/mask-icon.svg`

### Production Build

```bash
npm run build
```

Outputs to `dist/` folder with:
- Optimized React bundle
- Service worker (`sw.js`)
- Web manifest
- All assets

## 🌐 Deployment

Deploy to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

See [../../../DEPLOYMENT.md](../../../DEPLOYMENT.md) for detailed instructions.

## 🎨 Design System

### Colors
- **Primary**: `#0a0a0a` (black)
- **Background**: `#ffffff` (white)
- **Accents**: `#fafafa` (light gray)
- **Borders**: `#e5e5e5`
- **Coordinator Badges**: 8 color variations

### Typography
- **Font**: Inter, Segoe UI, system-ui
- **Headings**: 600 weight
- **Body**: 400 weight

### Responsive Breakpoints
- **Mobile**: ≤ 480px
- **Tablet**: ≤ 768px
- **Desktop**: > 768px

## 🔌 API Integration

Frontend connects to backend API:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Endpoints used:
GET  /companies?page=1&limit=50&sortBy=Name&sortOrder=asc
PATCH /company/:id/coordinator
PATCH /company/:id/status
GET  /coordinator-stats
```

## 🧪 Testing PWA

### Chrome DevTools
1. Open DevTools (F12)
2. Application tab → Manifest / Service Workers
3. Check all PWA criteria are met

### Lighthouse Audit
1. DevTools → Lighthouse
2. Select "Progressive Web App"
3. Run analysis (target: 100/100)

## 🐛 Troubleshooting

### Install button not showing
- Ensure HTTPS (or localhost)
- Check manifest in DevTools
- Verify service worker registered

### Offline mode not working
- Visit once online first
- Check service worker active
- Clear cache and retry

### Icons not displaying
- Run `npm run generate-icons`
- Check files exist in `dist/` after build

## 📄 License

Part of NSUT Placements tracking system.

## 🤝 Contributing

1. Make changes
2. Test locally (`npm run dev`)
3. Build (`npm run build`)
4. Test PWA (`npm run preview`)
5. Deploy

---

**Note**: Requires backend API to be running. See main project README for backend setup.
