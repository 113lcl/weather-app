# Weather Icons Storage

Place your custom pixel weather icons here. 

## Required Icons (32x32 or 64x64 PNG/SVG):

- sun.png / clear.svg - Sunny weather
- cloud.png - Cloudy weather
- rain.png - Rainy weather
- snow.png - Snow weather
- storm.png - Thunderstorm
- wind.png - Windy conditions
- humidity.png - Humidity indicator
- visibility.png - Visibility indicator
- pressure.png - Atmospheric pressure

## Recommended Resources:

- **itch.io** - Search "pixel weather icons"
- **OpenGameArt.org** - Free pixel art
- **Craftpix.net** - Pixel game assets
- **Aseprite** - Create custom pixel icons

## Usage:

Update the emoji mappings in `src/utils/weatherAPI.js` or import these SVG/PNG files as React components.

Current implementation uses Unicode emoji (☀️ ☁️ 🌧️ etc.) which works perfectly but you can replace with custom pixel images.
