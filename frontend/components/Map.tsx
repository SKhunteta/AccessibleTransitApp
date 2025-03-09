import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/api';
import { getAccessibleLocations } from '../services/api';
import { Icon } from 'leaflet';

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

function MapEventHandler({ onBoundsChange }: { onBoundsChange: (bounds: any) => void }) {
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

    const fetchLocations = async (bounds: any) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[600px] w-full relative">
            {loading && (
                <div className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-md shadow">
                    Loading...
                </div>
            )}
            <MapContainer
                center={[47.6062, -122.3321]}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
            </MapContainer>
        </div>
    );
} 