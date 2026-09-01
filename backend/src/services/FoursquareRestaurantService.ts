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
    formatted_address?: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
    rating?: number;
    price?: number;
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


/**
 * Searches Foursquare for restaurants matching room settings.
 */
export class FoursquareRestaurantService {

    private readonly apiUrl =
        "https://places-api.foursquare.com/places/search";

    private readonly restaurantCategory = "13065";


    /**
     * Searches Foursquare and returns cleaned restaurant results.
     */
    public async search(
        data: SearchRestaurantsData,
    ): Promise<RestaurantResult[]> {
        const apiKey = process.env.FOURSQUARE_API_KEY;

        if (!apiKey) {
            throw new Error(
                "Foursquare API key is missing.",
            );
        }

        const parameters = new URLSearchParams({
            query: data.cuisine,
            near: data.location,
            fsq_category_ids: this.restaurantCategory,
            sort: "RATING",
            limit: "20",
            fields: [
                "fsq_place_id",
                "name",
                "formatted_address",
                "latitude",
                "longitude",
                "distance",
                "rating",
                "price",
            ].join(","),
        });

        if (data.minPrice) {
            parameters.set(
                "min_price",
                data.minPrice.toString(),
            );
        }

        if (data.maxPrice) {
            parameters.set(
                "max_price",
                data.maxPrice.toString(),
            );
        }

        const response = await fetch(
            `${this.apiUrl}?${parameters.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    Accept: "application/json",
                    "X-Places-Api-Version": "2025-06-17",
                },
            },
        );

        if (!response.ok) {
            throw new Error(
                `Foursquare request failed with `
                + `${response.status}.`,
            );
        }

        const result =
            await response.json() as FoursquareResponse;

        const radiusMeters =
            this.convertMilesToMeters(
                data.radiusMiles,
            );

        return result.results
            .filter((place) =>
                this.matchesRadius(
                    place,
                    radiusMeters,
                )
            )
            .filter((place) =>
                this.matchesRating(
                    place,
                    data.minRating,
                )
            )
            .map((place) =>
                this.cleanRestaurant(place)
            );
    }


    /**
     * Checks whether the place is inside the chosen radius.
     */
    private matchesRadius(
        place: FoursquarePlace,
        radiusMeters: number,
    ): boolean {
        if (place.distance === undefined) {
            return true;
        }

        return place.distance <= radiusMeters;
    }


    /**
     * Checks whether the place meets the minimum rating.
     */
    private matchesRating(
        place: FoursquarePlace,
        minRating?: number,
    ): boolean {
        if (!minRating) {
            return true;
        }

        if (place.rating === undefined) {
            return false;
        }

        return this.convertRating(
            place.rating,
        ) >= minRating;
    }


    /**
     * Converts Foursquare data into DineMatch restaurant data.
     */
    private cleanRestaurant(
        place: FoursquarePlace,
    ): RestaurantResult {
        return {
            externalId: place.fsq_place_id,
            name: place.name,
            address:
                place.formatted_address
                ?? "Address unavailable",
            rating:
                place.rating !== undefined
                    ? this.convertRating(place.rating)
                    : undefined,
            priceLevel: place.price,
            latitude: place.latitude,
            longitude: place.longitude,
        };
    }


    /**
     * Converts Foursquare's ten-point rating to five stars.
     */
    private convertRating(
        rating: number,
    ): number {
        return Number(
            (rating / 2).toFixed(1),
        );
    }


    /**
     * Converts miles into meters.
     */
    private convertMilesToMeters(
        miles: number,
    ): number {
        return Math.round(
            miles * 1609.344,
        );
    }
}