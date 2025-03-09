# Transit Accessibility Assistant 🚌 ♿

A modern web application that helps users find wheelchair-accessible transit locations and facilities in their area. Built with Next.js and FastAPI, this application provides real-time accessibility information using OpenStreetMap data.

## Features ✨

- 🗺️ Interactive map interface using Leaflet
- 🔍 Real-time accessibility data from OpenStreetMap
- ♿ Wheelchair accessibility information for locations
- 🌐 Dynamic location updates as you pan and zoom
- 🎯 Precise location filtering within map bounds
- 💻 Modern, responsive UI design

## Tech Stack 🛠️

### Frontend

- Next.js 15.2
- React 19
- Leaflet/React-Leaflet for mapping
- Tailwind CSS for styling
- TypeScript for type safety
- Axios for API communication

### Backend

- FastAPI
- Python 3.11+
- Pydantic for data validation
- HTTPX for async HTTP requests
- Uvicorn as ASGI server

## Getting Started 🚀

### Prerequisites

- Node.js (version ^18.18.0 || ^19.8.0 || >= 20.0.0)
- Python 3.11 or higher
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/transit-accessibility-assistant.git
cd transit-accessibility-assistant
```

2. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload
```

3. Set up the frontend:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## API Endpoints 📡

- `GET /`: Welcome message
- `POST /accessibility`: Get accessible locations within specified bounds
  - Parameters:
    ```json
    {
      "lat_min": float,
      "lon_min": float,
      "lat_max": float,
      "lon_max": float
    }
    ```

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- OpenStreetMap contributors for the accessibility data
- Leaflet for the mapping library
- The FastAPI and Next.js communities
