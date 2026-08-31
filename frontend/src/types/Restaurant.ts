/**
 * Defines restaurant information displayed to users.
 */
export interface Restaurant {
    id: number;
    externalId: string;
    name: string;
    address: string;
    rating: number | null;
    priceLevel: number | null;
    latitude: number | null;
    longitude: number | null;
    imageUrl: string | null;
}