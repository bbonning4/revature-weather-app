# Weather Tracking Application
- React-Typescript w/ TailwindCSS frontend
- Python/Flask backend
- Prometheus and Grafana w/ Docker for metrics analysis

# Running Frontend
- Ensure all dependencies are installed: npm i
- Create a .env file with the following variables: 
    - VITE_API_KEY
    - VITE_AUTH_DOMAIN
    - VITE_PROJECT_ID
    - VITE_STORAGE_BUCKET
    - VITE_MESSAGING_SENDER_ID
    - VITE_APP_ID
- npm run dev

# Running Backend
- Create a .env file with the following variables: 
    - WEATHER_API_KEY
    - BASE_URL
- Create the virtual environment: python3 -m venv venv
- On Windows: venv\Scripts\activate  Otherwise: venv/bin/activate
- Ensure all dependencies are installed: pip install Flask requests python-dotenv prometheus_client flask_cors flask-socketio eventlet
- flask run

# Prometheus and Grafana
- For this project, prometheus and grafana will be running on docker containers
- Download the latest Docker Desktop: https://www.docker.com/products/docker-desktop/
- While Docker Desktop is running, run the following within the BACKEND directory: docker-compose up -d
- You should now be able to access Prometheus at localhost:9090 and Grafana at localhost:3000
- Default username/password for Grafana is admin/admin
- When setting up a new connection, select Prometheus and use the URL: http://prometheus:9090
- A Grafana dashboard is provided in BACKEND/util and can be imported to view the metrics, or create your own!