import { Database } from "../database/Database";
import { RoomRepository } from "../repositories/RoomRepository";
import { VoteRepository } from "../repositories/VoteRepository";

interface SubmitVoteData {
    code: string;
    participantId: number;
    restaurantId: number;
    vote: boolean;
}

export class SubmitVoteService {
    public async run(data: SubmitVoteData) {
        const roomRepository = new RoomRepository();
        const voteRepository = new VoteRepository();

        const room = await roomRepository.findByCode(data.code);

        if (!room) {
            throw new Error("Room not found.");
        }

        const membership = await Database.getPool().query(
            `
                SELECT 1
                FROM participants AS p
                JOIN room_restaurants AS rr
                    ON rr.room_id = p.room_id
                WHERE p.id = $1
                    AND p.room_id = $2
                    AND rr.restaurant_id = $3
            `,
            [data.participantId, room.id, data.restaurantId],
        );

        if (membership.rows.length === 0) {
            throw new Error(
                "Participant or restaurant does not belong to this room.",
            );
        }

        return voteRepository.save({
            roomId: room.id,
            participantId: data.participantId,
            restaurantId: data.restaurantId,
            vote: data.vote,
        });
    }
}