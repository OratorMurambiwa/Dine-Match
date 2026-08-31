import { ApiClient } from "./ApiClient";

import type { MatchResult } from "../types/MatchResult";
import type { Vote } from "../types/Vote";


/**
 * Handles frontend requests for voting and results.
 */
export class VoteService {

    /**
     * Sends one participant's restaurant vote to the backend.
     */
    public async submitVote(
        code: string,
        data: Vote,
    ): Promise<void> {
        const client = ApiClient.getClient();

        await client.post(
            `/rooms/${code}/votes`,
            data,
        );
    }


    /**
     * Gets the ranked restaurant results for one room.
     */
    public async getResults(
        code: string,
    ): Promise<MatchResult[]> {
        const client = ApiClient.getClient();

        const response = await client.get<MatchResult[]>(
            `/rooms/${code}/results`,
        );

        return response.data;
    }
}