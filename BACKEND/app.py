import os
from flask import Flask, request, jsonify
from flask_socketio import SocketIO # type: ignore
import requests
from prometheus_client import Gauge, generate_latest, CollectorRegistry, CONTENT_TYPE_LATEST
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

# Create a new registry for Prometheus
registry = CollectorRegistry()

# Define Prometheus Gauges in the custom registry
weather_temperature = Gauge("weather_temperature", "Temperature in Celsius", ["city"], registry=registry)
weather_humidity = Gauge("weather_humidity", "Humidity percentage", ["city"], registry=registry)
weather_wind_speed = Gauge("weather_wind_speed", "Wind speed in m/s", ["city"], registry=registry)
weather_pressure = Gauge("weather_pressure", "Atmospheric pressure in hPa", ["city"], registry=registry)

# Define Prometheus Gauges for forecast data (indexed by timestamp)
forecast_temperature = Gauge("forecast_temperature", "Forecasted temperature (°C)", ["city", "timestamp"], registry=registry)
forecast_humidity = Gauge("forecast_humidity", "Forecasted humidity (%)", ["city", "timestamp"], registry=registry)
forecast_wind_speed = Gauge("forecast_wind_speed", "Forecasted wind speed (m/s)", ["city", "timestamp"], registry=registry)
forecast_pressure = Gauge("forecast_pressure", "Forecasted pressure (hPa)", ["city", "timestamp"], registry=registry)

# OpenWeather API Config
load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = os.getenv("BASE_URL")
FORECAST_URL = os.getenv("FORECAST_URL")

# Store latest weather metrics
latest_weather_data = {}

@app.route('/weather', methods=['POST'])
def get_weather():
    global latest_weather_data  # Store latest metrics
    
    data = request.json
    cities = data.get("cities", [])

    if not cities:
        return jsonify({"error": "No cities provided"}), 400

    updated_data = {}  # Temporary dictionary to store new data

    for city in cities:
        response = requests.get(f"{BASE_URL}?q={city}&appid={WEATHER_API_KEY}&units=metric")
        
        if response.status_code == 200:
            weather_data = response.json()
            temp = weather_data["main"]["temp"]
            humidity = weather_data["main"]["humidity"]
            wind_speed = weather_data["wind"]["speed"]
            pressure = weather_data["main"]["pressure"]

            # Store metrics in the dictionary
            updated_data[city] = {
                "temperature": temp,
                "humidity": humidity,
                "wind_speed": wind_speed,
                "pressure": pressure,
            }

            # Update Prometheus metrics
            weather_temperature.labels(city=city).set(temp)
            weather_humidity.labels(city=city).set(humidity)
            weather_wind_speed.labels(city=city).set(wind_speed)
            weather_pressure.labels(city=city).set(pressure)

            print(f"✅ Updated metrics for {city}: Temp={temp}, Humidity={humidity}, Wind={wind_speed}, Pressure={pressure}")  
        else:
            print(f"❌ Failed to fetch weather for {city}: {response.status_code}")

    # Store the latest weather data
    latest_weather_data = updated_data

    # return jsonify({"message": "Weather data updated successfully"}), 200
    return jsonify({"weather_data": latest_weather_data}), 200

@app.route('/forecast', methods=['POST'])
def get_forecast():
    """Fetch weather forecast data for the next 5 days."""
    data = request.json
    cities = data.get("cities", [])

    if not cities:
        return jsonify({"error": "No cities provided"}), 400

    forecast_data = {}

    for city in cities:
        response = requests.get(f"{FORECAST_URL}?q={city}&appid={WEATHER_API_KEY}&units=metric")

        if response.status_code == 200:
            forecast = response.json()
            city_forecast = []

            for item in forecast["list"]:
                timestamp = item["dt"]  # Forecast timestamp
                temp = item["main"]["temp"]
                humidity = item["main"]["humidity"]
                wind_speed = item["wind"]["speed"]
                pressure = item["main"]["pressure"]

                city_forecast.append({
                    "timestamp": timestamp,
                    "temperature": temp,
                    "humidity": humidity,
                    "wind_speed": wind_speed,
                    "pressure": pressure
                })

                # Update Prometheus forecast metrics
                forecast_temperature.labels(city=city, timestamp=timestamp).set(temp)
                forecast_humidity.labels(city=city, timestamp=timestamp).set(humidity)
                forecast_wind_speed.labels(city=city, timestamp=timestamp).set(wind_speed)
                forecast_pressure.labels(city=city, timestamp=timestamp).set(pressure)

            forecast_data[city] = city_forecast
            print(f"✅ Updated forecast for {city}")

        else:
            print(f"❌ Failed to fetch forecast for {city}: {response.status_code}")

    return jsonify({"forecast_data": forecast_data}), 200

@app.route('/metrics')
def metrics():
    """Expose Prometheus metrics"""
    return generate_latest(registry), 200, {'Content-Type': CONTENT_TYPE_LATEST}

@app.route("/alerts", methods=["POST"])
def handle_alert():
    print(f"Received alert: {request.json}")  # Print the incoming alert
    alert = request.json  # Get alert data
    socketio.emit("new_alert", alert)  # Send to frontend
    return {"status": "received"}, 200

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)