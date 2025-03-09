import axios from 'axios';
import { AccessibilityQuery, AccessibilityResponse } from '../types/api';

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