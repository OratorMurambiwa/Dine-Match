import { Database } from "../database/Database";


interface CreateRoomData {
    code: string;
    name: string;
    location: string;
    radiusMiles: number;
    cuisine: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}


/**
 * Handles database queries for DineMatch rooms.
 */
export class RoomRepository {

    /**
     * Creates a room and returns the saved room.
     */
    public async create(data: CreateRoomData) {
        const database = Database.getPool();

        const query = `
            INSERT INTO rooms (
                code,
                name,
                location,
                radius_miles,
                cuisine,
                min_price,
                max_price,
                min_rating
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;

        const values = [
            data.code,
            data.name,
            data.location,
            data.radiusMiles,
            data.cuisine,
            data.minPrice ?? null,
            data.maxPrice ?? null,
            data.minRating ?? null,
        ];

        const result = await database.query(query, values);

        return result.rows[0];
    }


    /**
     * Finds one room using its shareable room code.
     */
    public async findByCode(code: string) {
        const database = Database.getPool();

        const query = `
            SELECT *
            FROM rooms
            WHERE code = $1;
        `;

        const result = await database.query(query, [code]);

        return result.rows[0] ?? null;
    }
}