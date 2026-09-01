import {
    RestaurantRepository,
} from "../repositories/RestaurantRepository";

import {
    RoomRepository,
} from "../repositories/RoomRepository";

import {
    FoursquareRestaurantService,
} from "./FoursquareRestaurantService";

import {
    MockRestaurantService,
} from "./MockRestaurantService";


/**
 * Handles restaurant results for a DineMatch room.
 */
export class GetRestaurantsService {

    /**
     * Gets cached restaurants or searches for new ones.
     */
    public async run(code: string) {
        const roomRepository =
            new RoomRepository();

        const restaurantRepository =
            new RestaurantRepository();

        const room =
            await roomRepository.findByCode(code);

        if (!room) {
            return [];
        }

        const savedRestaurants =
            await restaurantRepository.findByRoom(
                room.id,
            );

        // Reuse saved restaurants to avoid repeated API calls.
        if (savedRestaurants.length > 0) {
            return savedRestaurants;
        }

        const useMockRestaurants =
            process.env.USE_MOCK_RESTAURANTS === "true";

        let restaurants;

        if (useMockRestaurants) {
            const mockRestaurantService =
                new MockRestaurantService();

            restaurants =
                await mockRestaurantService.search();

        } else {
            const foursquareRestaurantService =
                new FoursquareRestaurantService();

            restaurants =
                await foursquareRestaurantService.search({
                    location: room.location,
                    radiusMiles: room.radiusMiles,
                    cuisine: room.cuisine,
                    minPrice: room.minPrice,
                    maxPrice: room.maxPrice,
                    minRating: room.minRating,
                });
        }

        for (const restaurant of restaurants) {
            const savedRestaurant =
                await restaurantRepository.create(
                    restaurant,
                );

            await restaurantRepository.addToRoom(
                room.id,
                savedRestaurant.id,
            );
        }

        return restaurantRepository.findByRoom(
            room.id,
        );
    }
}