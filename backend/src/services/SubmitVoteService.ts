import { RoomRepository } from "../repositories/RoomRepository";
import { VoteRepository } from "../repositories/VoteRepository";


interface SubmitVoteData {
    code: string;
    participantId: number;
    restaurantId: number;
    vote: boolean;
}


/**
 * Handles the logic for saving restaurant votes.
 */
export class SubmitVoteService {

    /**
     * Checks the room and saves or updates the vote.
     */
    public async run(data: SubmitVoteData) {
        const roomRepository = new RoomRepository();
        const voteRepository = new VoteRepository();

        const room = await roomRepository.findByCode(data.code);

        if (!room) {
            throw new Error("Room not found.");
        }

        return voteRepository.save({
            roomId: room.id,
            participantId: data.participantId,
            restaurantId: data.restaurantId,
            vote: data.vote,
        });
    }
}