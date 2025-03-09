'use client';

import dynamic from 'next/dynamic';
import { Location } from '../types/api';

const Map = dynamic(() => import('../components/Map'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
            Loading map...
        </div>
    ),
});

export default function Home() {
    const handleLocationsUpdate = (locations: Location[]) => {
        console.log('Found accessible locations:', locations);
    };

    return (
        <main className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    Transit Accessibility Assistant
                </h1>
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <Map onLocationsUpdate={handleLocationsUpdate} />
                </div>
                <p className="mt-4 text-center text-gray-600">
                    Explore accessible transit locations in your area. Pan and zoom the map to discover more locations.
                </p>
            </div>
        </main>
    );
}
