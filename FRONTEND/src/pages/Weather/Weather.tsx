import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { io } from "socket.io-client";

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

const socket = io("http://localhost:5000");

const Weather: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherAlert, setWeatherAlert] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

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

  // Listen for new alerts from the backend
  useEffect(() => {
    socket.on(
      "new_alert",
      (alertData: { alerts: [{ annotations: { description: string } }] }) => {
        setWeatherAlert(
          alertData.alerts[0]?.annotations?.description || "No description"
        );
        setAlertVisible(true);
      }
    );

    return () => {
      socket.off("new_alert");
    };
  }, []);

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
    return <div>Loading...</div>;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 place-items-center">
        {weatherData &&
          Object.entries(weatherData.weather_data).map(([city, data]) => (
            <div
              key={city}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 w-full max-w-xs md:max-w-sm"
            >
              <h3 className="text-xl font-bold text-primary-600 mb-4">
                {city}
              </h3>
              <p className="text-gray-600">
                🌡️ Temperature: {data.temperature}°C
              </p>
              <p className="text-gray-600">💧 Humidity: {data.humidity}%</p>
              <p className="text-gray-600">
                🌬️ Wind Speed: {data.wind_speed} m/s
              </p>
              <p className="text-gray-600">📊 Pressure: {data.pressure} hPa</p>
            </div>
          ))}
      </div>

      {/* Alert Popup */}
      {weatherAlert && alertVisible && (
        <div className="fixed top-0 left-0 w-full flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 animate-slideDown">
            <h2 className="text-xl font-bold">New Alert</h2>
            <p>{weatherAlert}</p>
            <button
              onClick={() => setWeatherAlert(null)}
              className="mt-4 bg-primary-500 text-white py-2 px-4 rounded-md cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
