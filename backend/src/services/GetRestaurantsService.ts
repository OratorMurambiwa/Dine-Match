import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { RoomRepository } from "../repositories/RoomRepository";


/**
 * Handles restaurant results for a DineMatch room.
 */
export class GetRestaurantsService {

    /**
     * Gets the restaurants saved for the requested room.
     */
    public async run(code: string) {
        const roomRepository = new RoomRepository();
        const restaurantRepository = new RestaurantRepository();

        const room = await roomRepository.findByCode(code);

        // Stop if the requested room does not exist.
        if (!room) {
            return [];
        }

        return restaurantRepository.findByRoom(room.id);
    }
}