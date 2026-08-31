/**
 * Defines the room information returned by the backend.
 */
export interface Room {
    id: number;
    code: string;
    name: string;
    location: string;
    radiusMiles: number;
    cuisine: string;
    minPrice: number | null;
    maxPrice: number | null;
    minRating: number | null;
}