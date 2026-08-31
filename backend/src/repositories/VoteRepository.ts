import { Database } from "../database/Database";


interface SaveVoteData {
    roomId: number;
    participantId: number;
    restaurantId: number;
    vote: boolean;
}


/**
 * Handles database queries for restaurant votes.
 */
export class VoteRepository {

    /**
     * Creates a vote or updates the participant's existing vote.
     */
    public async save(data: SaveVoteData) {
        const database = Database.getPool();

        const query = `
            INSERT INTO votes (
                room_id,
                participant_id,
                restaurant_id,
                vote
            )
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (
                participant_id,
                restaurant_id
            )
            DO UPDATE SET
                vote = EXCLUDED.vote
            RETURNING *;
        `;

        const values = [
            data.roomId,
            data.participantId,
            data.restaurantId,
            data.vote,
        ];

        const result = await database.query(query, values);

        return result.rows[0];
    }


    /**
     * Calculates and returns ranked restaurant results.
     */
    public async getResults(roomId: number) {
        const database = Database.getPool();

        const query = `
            SELECT
                restaurants.id AS "restaurantId",
                restaurants.name AS restaurant,
                COUNT(votes.id) FILTER (
                    WHERE votes.vote = TRUE
                )::INTEGER AS "yesVotes",
                COUNT(DISTINCT participants.id)::INTEGER
                    AS participants,
                ROUND(
                    (
                        COUNT(votes.id) FILTER (
                            WHERE votes.vote = TRUE
                        )::DECIMAL
                        /
                        NULLIF(
                            COUNT(DISTINCT participants.id),
                            0
                        )
                    ) * 100,
                    2
                ) AS "matchPercentage"
            FROM restaurants
            INNER JOIN room_restaurants
                ON restaurants.id = room_restaurants.restaurant_id
            INNER JOIN rooms
                ON rooms.id = room_restaurants.room_id
            LEFT JOIN participants
                ON participants.room_id = rooms.id
            LEFT JOIN votes
                ON votes.room_id = rooms.id
                AND votes.restaurant_id = restaurants.id
                AND votes.participant_id = participants.id
            WHERE rooms.id = $1
            GROUP BY restaurants.id, restaurants.name
            ORDER BY "matchPercentage" DESC;
        `;

        const result = await database.query(query, [roomId]);

        return result.rows.map((row) => ({
            ...row,
            matchPercentage: Number(row.matchPercentage ?? 0),
        }));
    }
}