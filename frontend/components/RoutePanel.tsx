import { useState } from 'react';
import { LatLng } from 'leaflet';

interface RoutePanelProps {
    onRouteRequest: (start: LatLng, end: LatLng) => void;
    isLoading?: boolean;
    routeError?: string | null;
}

export default function RoutePanel({ onRouteRequest, isLoading, routeError }: RoutePanelProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Geocode addresses to LatLng
    };

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-transform duration-300 transform ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'} rounded-t-xl z-[1000] max-w-xl mx-auto`}>
            <div 
                className="p-2 text-center cursor-pointer bg-gray-50 rounded-t-xl"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-1" />
                <span className="text-gray-600 text-sm">
                    {isExpanded ? 'Swipe down to minimize' : 'Swipe up to plan route'}
                </span>
            </div>
            
            <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                            Start Location
                        </label>
                        <input
                            type="text"
                            id="start"
                            value={startLocation}
                            onChange={(e) => setStartLocation(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-black bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter start location"
                        />
                    </div>

                    <div>
                        <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                            Destination
                        </label>
                        <input
                            type="text"
                            id="end"
                            value={endLocation}
                            onChange={(e) => setEndLocation(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-black bg-white rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            placeholder="Enter destination"
                        />
                    </div>

                    {routeError && (
                        <div className="text-red-600 text-sm p-2 bg-red-50 rounded-md">
                            {routeError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !startLocation || !endLocation}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Finding Route...' : 'Find Accessible Route'}
                    </button>
                </form>
            </div>
        </div>
    );
} 