import { ApiClient } from "./ApiClient";

import type { Restaurant } from "../types/Restaurant";


/**
 * Handles frontend requests for restaurant information.
 */
export class RestaurantService {

    /**
     * Gets the restaurants available for one room.
     */
    public async getRestaurants(
        code: string,
    ): Promise<Restaurant[]> {
        const client = ApiClient.getClient();

        const response = await client.get<Restaurant[]>(
            `/rooms/${code}/restaurants`,
        );

        return response.data;
    }
}