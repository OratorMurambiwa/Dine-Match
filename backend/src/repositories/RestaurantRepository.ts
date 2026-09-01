import { Database } from "../database/Database";


interface CreateRestaurantData {
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
 * Handles database queries for restaurants.
 */
export class RestaurantRepository {

    /**
     * Saves a restaurant and returns its database record.
     */
    public async create(data: CreateRestaurantData) {
        const database = Database.getPool();

        const query = `
            INSERT INTO restaurants (
                external_id,
                name,
                address,
                rating,
                price_level,
                latitude,
                longitude,
                image_url
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
            )
            ON CONFLICT (external_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                address = EXCLUDED.address,
                rating = EXCLUDED.rating,
                price_level = EXCLUDED.price_level,
                latitude = EXCLUDED.latitude,
                longitude = EXCLUDED.longitude,
                image_url = EXCLUDED.image_url
            RETURNING
                id,
                external_id AS "externalId",
                name,
                address,
                rating,
                price_level AS "priceLevel",
                latitude,
                longitude,
                image_url AS "imageUrl";
        `;

        const values = [
            data.externalId,
            data.name,
            data.address,
            data.rating ?? null,
            data.priceLevel ?? null,
            data.latitude ?? null,
            data.longitude ?? null,
            data.imageUrl ?? null,
        ];

        const result = await database.query(
            query,
            values,
        );

        return result.rows[0];
    }


    /**
     * Gets every restaurant linked to one room.
     */
    public async findByRoom(roomId: number) {
        const database = Database.getPool();

        const query = `
            SELECT
                restaurants.id,
                restaurants.external_id AS "externalId",
                restaurants.name,
                restaurants.address,
                restaurants.rating,
                restaurants.price_level AS "priceLevel",
                restaurants.latitude,
                restaurants.longitude,
                restaurants.image_url AS "imageUrl"
            FROM restaurants
            INNER JOIN room_restaurants
                ON restaurants.id =
                    room_restaurants.restaurant_id
            WHERE room_restaurants.room_id = $1
            ORDER BY
                restaurants.rating DESC NULLS LAST;
        `;

        const result = await database.query(
            query,
            [roomId],
        );

        return result.rows;
    }


    /**
     * Links a saved restaurant to a DineMatch room.
     */
    public async addToRoom(
        roomId: number,
        restaurantId: number,
    ): Promise<void> {
        const database = Database.getPool();

        const query = `
            INSERT INTO room_restaurants (
                room_id,
                restaurant_id
            )
            VALUES (
                $1,
                $2
            )
            ON CONFLICT DO NOTHING;
        `;

        await database.query(
            query,
            [
                roomId,
                restaurantId,
            ],
        );
    }
}