import { Request, Response } from "express";

import { SubmitVoteService } from "../services/SubmitVoteService";


/**
 * Handles YES or NO votes for a restaurant.
 */
export class SubmitVoteController {

    /**
     * Saves one participant's vote for one restaurant.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            const {
                participantId,
                restaurantId,
                vote,
            } = req.body;

            // Make sure all information needed for the vote exists.
            if (
                !code ||
                !participantId ||
                !restaurantId ||
                typeof vote !== "boolean"
            ) {
                return res.status(400).json({
                    message: "Invalid vote information.",
                });
            }

            const submitVoteService = new SubmitVoteService();

            const savedVote = await submitVoteService.run({
                code,
                participantId,
                restaurantId,
                vote,
            });

            return res.status(201).json(savedVote);

        } catch (error) {
            // Return a general error if the vote could not be saved.
            return res.status(500).json({
                message: "Could not save the vote.",
            });
        }
    }
}