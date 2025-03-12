import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/api';
import { getAccessibleLocations } from '../services/api';
import { Icon, LatLng, LatLngBounds } from 'leaflet';
import { AxiosError } from 'axios';
import RoutePanel from './RoutePanel';

// Fix for default marker icons in Next.js
const icon = new Icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    onLocationsUpdate?: (locations: Location[]) => void;
}

function MapEventHandler({ onBoundsChange }: { onBoundsChange: (bounds: LatLngBounds) => void }) {
    const map = useMapEvents({
        moveend: () => {
            const bounds = map.getBounds();
            onBoundsChange(bounds);
        },
    });
    return null;
}

export default function Map({ onLocationsUpdate }: MapProps) {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [route, setRoute] = useState<LatLng[]>([]);
    const [routeDetails, setRouteDetails] = useState<string | null>(null);

    const fetchLocations = async (bounds: LatLngBounds) => {
        try {
            setLoading(true);
            setError(null);
            const query = {
                lat_min: bounds.getSouth(),
                lon_min: bounds.getWest(),
                lat_max: bounds.getNorth(),
                lon_max: bounds.getEast(),
            };
            const response = await getAccessibleLocations(query);
            setLocations(response.locations);
            onLocationsUpdate?.(response.locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            let errorMessage = 'Failed to fetch locations. Please try again later.';
            if (error instanceof AxiosError) {
                if (error.response?.status === 503) {
                    errorMessage = 'The accessibility service is temporarily unavailable. Please try again in a few moments.';
                } else if (error.response?.status === 500) {
                    errorMessage = 'An error occurred while fetching locations. Please try zooming in or moving to a different area.';
                }
            }
            setError(errorMessage);
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRouteRequest = async (start: LatLng, end: LatLng) => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Call backend route finding API
            // For now, just draw a straight line
            setRoute([start, end]);
            setRouteDetails('Route details will appear here');
        } catch (error) {
            setError('Failed to find route. Please try again.');
            setRoute([]);
            setRouteDetails(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full relative">
            {loading && (
                <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow">
                    Loading...
                </div>
            )}
            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md shadow-lg max-w-md text-center">
                    {error}
                </div>
            )}
            <MapContainer
                center={[47.6062, -122.3321]}
                zoom={13}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapEventHandler onBoundsChange={fetchLocations} />
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={[location.latitude, location.longitude]}
                        icon={icon}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold">{location.name}</h3>
                                <p>Accessibility: {location.accessibility}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {route.length > 0 && (
                    <Polyline 
                        positions={route}
                        color="blue"
                        weight={3}
                        opacity={0.7}
                    />
                )}
            </MapContainer>
            <RoutePanel
                onRouteRequest={handleRouteRequest}
                isLoading={loading}
                routeError={error}
            />
        </div>
    );
} 