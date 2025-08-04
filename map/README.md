# EV BES Map Application

## Weather API Setup

This application uses the WeatherStack API to fetch real-time weather data for route calculations. If you're experiencing 401 errors, follow these steps to set up a valid API key:

### Getting a WeatherStack API Key

1. **Visit WeatherStack**: Go to [https://weatherstack.com/](https://weatherstack.com/)

2. **Sign Up**: Create a free account to get an API key

3. **Get Your API Key**: After signing up, you'll receive a free API key (1000 requests/month)

4. **Update Configuration**: Replace the placeholder in `../api/map-config.json`:
   ```json
   {
     "weatherstackApiKey": "YOUR_ACTUAL_API_KEY_HERE"
   }
   ```

### Free Tier Limitations

- **1000 requests per month** (free tier)
- **Real-time weather data**
- **Historical data** (limited in free tier)
- **Weather forecasts** (limited in free tier)

### Alternative Solutions

If you don't want to use WeatherStack:

1. **Use Default Weather Data**: The application will automatically use default weather data when the API is unavailable
2. **Other Weather APIs**: You can modify the code to use other weather APIs like:
   - OpenWeatherMap
   - WeatherAPI
   - AccuWeather

### Error Handling

The application now includes robust error handling:
- **401 Errors**: Invalid/expired API key → Uses default weather data
- **429 Errors**: Rate limit exceeded → Uses default weather data
- **Network Errors**: Connection issues → Uses default weather data

### Default Weather Data

When the API is unavailable, the application uses these default values:
- Temperature: 25°C
- Wind Speed: 5 km/h
- Humidity: 60%
- Condition: "Partly cloudy"
- UV Index: 5
- Visibility: 10 km

This ensures the application continues to function even without a valid weather API key. 