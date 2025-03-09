export interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    accessibility: string;
}

export interface AccessibilityResponse {
    locations: Location[];
}

export interface AccessibilityQuery {
    lat_min: number;
    lon_min: number;
    lat_max: number;
    lon_max: number;
} 