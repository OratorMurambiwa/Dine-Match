interface RestaurantResult {
    externalId: string;
    name: string;
    address: string;
    rating?: number;
    priceLevel?: number;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
}


/**
 * Provides sample restaurants for local development.
 */
export class MockRestaurantService {

    /**
     * Returns sample restaurant data without calling an API.
     */
    public async search(): Promise<RestaurantResult[]> {
        return [
            {
                externalId: "mock-restaurant-1",
                name: "La Taqueria",
                address: "2889 Mission St, San Francisco, CA",
                rating: 4.6,
                priceLevel: 1,
                latitude: 37.7509,
                longitude: -122.4180,
            },
            {
                externalId: "mock-restaurant-2",
                name: "El Farolito",
                address: "2779 Mission St, San Francisco, CA",
                rating: 4.5,
                priceLevel: 1,
                latitude: 37.7526,
                longitude: -122.4184,
            },
            {
                externalId: "mock-restaurant-3",
                name: "Tropisueño",
                address: "75 Yerba Buena Ln, San Francisco, CA",
                rating: 4.4,
                priceLevel: 2,
                latitude: 37.7856,
                longitude: -122.4038,
            },
            {
                externalId: "mock-restaurant-4",
                name: "Nopalito",
                address: "306 Broderick St, San Francisco, CA",
                rating: 4.3,
                priceLevel: 2,
                latitude: 37.7735,
                longitude: -122.4393,
            },
        ];
    }
}