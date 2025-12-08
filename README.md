# MyNewTab
A minimalist, performance-focused new tab dashboard for Chrome. Features dynamic greetings, real-time weather, and cloud-hosted wallpapers.

![Preview](https://via.placeholder.com/800x400?text=Insert+Your+Screenshot+Here)

## Features
- **Zero-Bloat:** Built with vanilla HTML, CSS, and JS. No frameworks.
- **Dynamic Wallpapers:** Fetches high-res images from a GitHub repository.
- **Privacy-First:** Weather data is fetched via Open-Meteo (no API keys required).
- **Customizable:** Remembers your name and preferred search engine.
- **Glassmorphism UI:** Modern, frosted-glass aesthetic using CSS backdrop-filter.

## Installation

1. Clone or download this repository.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer Mode** (top right toggle).
4. Click **Load Unpacked**.
5. Select the folder containing `manifest.json`.

## Configuration

### Changing Wallpapers
The wallpaper logic pulls from a public GitHub repository. To use your own images:

1. Open `logic.js`.
2. Edit the `REPO_CONFIG` object at the top:
   ```javascript
   const REPO_CONFIG = {
     owner: 'YOUR_GITHUB_USERNAME',
     repo: 'YOUR_WALLPAPER_REPO_NAME',
     branch: 'main'
   };