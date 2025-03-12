import axios from 'axios';
import { AccessibilityQuery, AccessibilityResponse } from '../types/api';
import { LatLng } from 'leaflet';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAccessibleLocations = async (query: AccessibilityQuery): Promise<AccessibilityResponse> => {
    const response = await api.post<AccessibilityResponse>('/accessibility', query);
    return response.data;
};

export interface RouteStep {
    instruction: string;
    distance: number;
    duration: number;
    accessibility_notes: string;
    start_location: [number, number];
    end_location: [number, number];
}

export interface RouteResponse {
    steps: RouteStep[];
    total_distance: number;
    total_duration: number;
    accessibility_score: number;
}

export const findAccessibleRoute = async (start: LatLng, end: LatLng): Promise<RouteResponse> => {
    const response = await api.post<RouteResponse>('/route', {
        start_lat: start.lat,
        start_lon: start.lng,
        end_lat: end.lat,
        end_lon: end.lng,
    });
    return response.data;
}; 