interface SearchRestaurantsData {
    location: string;
    radiusMiles: number;
    cuisine: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}

interface FoursquarePlace {
    fsq_place_id: string;
    name: string;
    location?: {
        formatted_address?: string;
        address?: string;
        locality?: string;
        region?: string;
        postcode?: string;
    };
    latitude?: number;
    longitude?: number;
    distance?: number;
}

interface FoursquareResponse {
    results: FoursquarePlace[];
}

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

export class FoursquareRestaurantService {
    private readonly apiUrl =
        "https://places-api.foursquare.com/places/search";

    public async search(
        data: SearchRestaurantsData,
    ): Promise<RestaurantResult[]> {
        const apiKey = process.env.FOURSQUARE_API_KEY?.trim();

        if (!apiKey) {
            throw new Error("Foursquare Service API Key is missing.");
        }

        const parameters = new URLSearchParams({
            query: `${data.cuisine.trim()} restaurant`,
            near: data.location,
            sort: "DISTANCE",
            limit: "20",
            fields: [
                "fsq_place_id",
                "name",
                "location",
                "latitude",
                "longitude",
                "distance",
            ].join(","),
        });

        const response = await fetch(
            `${this.apiUrl}?${parameters.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                    "X-Places-Api-Version": "2025-06-17",
                },
                signal: AbortSignal.timeout(15000),
            },
        );

        if (!response.ok) {
            const details = await response.text();
            const retryAfter = response.headers.get("retry-after");

            throw new Error(
                `Foursquare request failed with ${response.status}.\n`
                + `Details: ${details}\n`
                + `Retry after: ${retryAfter ?? "Not provided"}`,
            );
        }

        const result = await response.json() as FoursquareResponse;

        if (!Array.isArray(result.results)) {
            throw new Error(
                "Foursquare returned an unexpected response.",
            );
        }

        const radiusMeters = Math.round(data.radiusMiles * 1609.344);

        return result.results
            .filter((place) =>
                place.distance !== undefined &&
                place.distance <= radiusMeters,
            )
            .map((place) => ({
                externalId: place.fsq_place_id,
                name: place.name,
                address: this.formatAddress(place),
                latitude: place.latitude,
                longitude: place.longitude,
            }));
    }

    private formatAddress(place: FoursquarePlace): string {
        const location = place.location;

        if (location?.formatted_address) {
            return location.formatted_address;
        }

        const address = [
            location?.address,
            location?.locality,
            location?.region,
            location?.postcode,
        ]
            .filter(Boolean)
            .join(", ");

        return address || "Address unavailable";
    }
}