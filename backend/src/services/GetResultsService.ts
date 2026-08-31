import { RoomRepository } from "../repositories/RoomRepository";
import { VoteRepository } from "../repositories/VoteRepository";


/**
 * Handles the ranked restaurant results for a room.
 */
export class GetResultsService {

    /**
     * Calculates match percentages and ranks restaurants.
     */
    public async run(code: string) {
        const roomRepository = new RoomRepository();
        const voteRepository = new VoteRepository();

        const room = await roomRepository.findByCode(code);

        if (!room) {
            return [];
        }

        const results = await voteRepository.getResults(room.id);

        return results.sort(
            (first, second) =>
                second.matchPercentage - first.matchPercentage
        );
    }
}