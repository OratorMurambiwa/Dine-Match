import { Database } from "../database/Database";


interface CreateParticipantData {
    roomId: number;
    name: string;
}


/**
 * Handles database queries for room participants.
 */
export class ParticipantRepository {

    /**
     * Adds a participant to a DineMatch room.
     */
    public async create(data: CreateParticipantData) {
        const database = Database.getPool();

        const query = `
            INSERT INTO participants (
                room_id,
                name
            )
            VALUES ($1, $2)
            RETURNING *;
        `;

        const values = [
            data.roomId,
            data.name,
        ];

        const result = await database.query(query, values);

        return result.rows[0];
    }


    /**
     * Gets all participants inside one room.
     */
    public async findByRoom(roomId: number) {
        const database = Database.getPool();

        const query = `
            SELECT *
            FROM participants
            WHERE room_id = $1
            ORDER BY id;
        `;

        const result = await database.query(query, [roomId]);

        return result.rows;
    }
}