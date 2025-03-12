import React, { useState } from "react";
import axios from "axios";

// List of cities for selection
const citiesList = ["New York", "London", "Mumbai", "Tokyo", "Sydney", "Dubai"];

// Type for weather data to be fetched
interface CityWeather {
  humidity: number;
  pressure: number;
  temperature: number;
  wind_speed: number;
}

interface WeatherData {
  weather_data: Record<string, CityWeather>; // Object where keys are city names
}

const Weather: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // Handle the change of selected cities
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    if (selectedOptions.length <= 3) {
      setSelectedCities(selectedOptions);
    }
  };

  // Fetch weather data from the backend
  const fetchWeather = async () => {
    if (selectedCities.length < 3) {
      alert("Please select at least 3 cities.");
      return;
    }

    console.log("Sending request with cities:", selectedCities); // Debugging Log

    try {
      const response = await axios.post("http://localhost:5000/weather", {
        cities: selectedCities,
      });

      console.log("Response from backend:", response); // Debugging Log
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Weather Tracking Dashboard
      </h1>

      {/* City Selection Dropdown */}
      <select
        multiple
        value={selectedCities}
        onChange={handleCityChange}
        className="w-full p-2 border rounded-md mb-4"
      >
        {citiesList.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      {/* Get Weather Data Button */}
      <button
        onClick={fetchWeather}
        disabled={selectedCities.length < 3}
        className="w-full py-2 bg-primary-500 text-white font-semibold rounded-md disabled:bg-gray-300"
      >
        Get Weather Data
      </button>

      {/* Weather Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {weatherData &&
          Object.entries(weatherData.weather_data).map(([city, data]) => (
            <div key={city}>
              <h3>{city}</h3>
              <p>Temperature: {data.temperature}°C</p>
              <p>Humidity: {data.humidity}%</p>
              <p>Wind Speed: {data.wind_speed} m/s</p>
              <p>Pressure: {data.pressure} hPa</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Weather;
