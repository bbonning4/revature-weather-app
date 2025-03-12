import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
  weather_data: Record<string, CityWeather>;
}

const Weather: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

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
    if (selectedCities.length < 1) {
      alert("Please select at least 1 city.");
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // No user is logged in, redirect to /login
        navigate("/login");
      } else {
        setLoading(false);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>; // You can show a loading state until authentication is confirmed
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Weather Tracking Dashboard
      </h1>

      {/* City Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Select Cities</label>
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-white border border-gray-300 rounded-md shadow-sm">
          {citiesList.map((city) => (
            <div key={city} className="flex items-center">
              <input
                type="checkbox"
                value={city}
                checked={selectedCities.includes(city)}
                onChange={(e) => {
                  const newSelectedCities = e.target.checked
                    ? [...selectedCities, city]
                    : selectedCities.filter(
                        (selectedCity) => selectedCity !== city
                      );
                  setSelectedCities(newSelectedCities);
                }}
                id={city}
                className="h-4 w-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor={city} className="ml-2 text-sm text-gray-700">
                {city}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-400">
          {selectedCities.length} selected
        </div>
      </div>

      {/* Get Weather Data Button */}
      <button
        onClick={fetchWeather}
        disabled={selectedCities.length < 1}
        className="w-full py-2 bg-primary-500 text-white font-semibold rounded-md disabled:bg-gray-300 enabled:cursor-pointer"
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
