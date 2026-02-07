# Shri Pandit Ji PWA

Progressive Web App for the Shri Pandit Ji website (https://shripanditji.in/)

## Features

- 📱 Installable on mobile devices
- 🔌 Offline functionality with service workers
- ⚡ Fast loading with intelligent caching
- 📦 Can be packaged as Android APK

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate SSL certificates for HTTPS (required for service workers):
```bash
npm run generate-cert
```

3. Start the development server:
```bash
npm run dev
```

4. Open https://localhost:8443 in your browser
   - You may need to accept the self-signed certificate warning

## Project Structure

```
shripanditji-pwa/
├── icons/              # App icons in various sizes
├── assets/             # Static assets (images, fonts, etc.)
├── test/               # Test files
├── index.html          # Main app shell
├── manifest.json       # Web app manifest
├── sw.js              # Service worker
├── styles.css         # App styles
├── app.js             # Main application logic
└── offline.html       # Offline fallback page
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Building for Production

The PWA can be converted to an Android APK using:
- PWA Builder: https://www.pwabuilder.com/
- Bubblewrap CLI: https://github.com/GoogleChromeLabs/bubblewrap

See APK-GENERATION.md for detailed instructions (to be created).

## License

MIT
