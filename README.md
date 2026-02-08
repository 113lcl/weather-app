# ⚡ PIXEL WEATHER ⚡

A retro-style web weather application built with React and Vite. Features a pixelated design inspired by classic 8-bit games with dark/light theme support.

## Features

✅ **Current Weather** - Real-time weather data with detailed conditions
✅ **5-Day Forecast** - Weather predictions for the next 5 days
✅ **City Search** - Search any city worldwide
✅ **Geolocation** - Get weather for your current location
✅ **Saved Cities** - Save favorite cities for quick access
✅ **Unit Toggle** - Switch between Celsius and Fahrenheit
✅ **Dark/Light Mode** - Retro pixel-themed interface with two modes
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile
✅ **Pixel Animations** - Classic game-style animations and effects
✅ **Local Storage** - Persistent settings and saved cities
✅ **100% Free** - Uses Open-Meteo API (no API key required!)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool (lightning fast)
- **Open-Meteo API** - Free weather data (no API key needed!)
- **CSS3** - Pixel-style design with animations

## Setup Instructions

### 1. Navigate to Project
```bash
cd c:\Users\user\Desktop\work\test\weather
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The app will open at [http://localhost:5173](http://localhost:5173) automatically.

### 4. Build for Production
```bash
npm run build
```
Output will be in `weather-app/` folder - ready to deploy!

## How to Use

1. **Search Weather**: Enter a city name and click "SEARCH" or "LOCATE" for your current location
2. **View Forecast**: See the 5-day forecast below current weather
3. **Save Cities**: Click "SAVE [CITY]" to add to favorites
4. **Toggle Units**: Switch between °C and °F
5. **Change Theme**: Toggle between dark and light mode
6. **Remove Cities**: Hover over saved city and click ✕

## File Structure
```
weather/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── Forecast.jsx
│   │   ├── Settings.jsx
│   │   └── SavedCities.jsx
│   ├── utils/
│   │   └── weatherAPI.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## API Details

Uses **Open-Meteo** - A completely free weather API:
- ✅ No registration required
- ✅ No API key needed
- ✅ Unlimited requests
- ✅ 40+ weather parameters
- ✅ Great documentation

Learn more: [open-meteo.com](https://open-meteo.com)

## Styling Features

- **Pixel Font**: Press Start 2P for headers, Courier New for text
- **Retro Colors**: Black/White theme with green/magenta accents
- **Pixel Animations**: Blink, bounce, glow effects
- **No Border Radius**: Sharp pixel-perfect corners
- **Responsive Grid**: Auto-adjusts for all screen sizes

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)

## Deployment Options

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Build: `npm run build`
2. Drag and drop `weather-app` folder to Netlify

### Deploy to GitHub Pages
1. Update `vite.config.js` with your repo name
2. Build: `npm run build`
3. Push to GitHub

## Future Enhancements

- [ ] Air quality index (AQI)
- [ ] Hourly forecast
- [ ] Weather alerts
- [ ] Multiple language support
- [ ] PWA support (offline mode)
- [ ] Custom pixel weather icons

## License

MIT - Free to use and modify

## Credits

Built with ❤️ by Tymofii Kyrychenko
Weather data by [Open-Meteo](https://open-meteo.com/) - Free weather API
