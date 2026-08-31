import { Router } from "express";

import {
    SubmitVoteController,
} from "../controllers/SubmitVoteController";


/**
 * Defines API routes used for restaurant voting.
 */
export class VoteRoutes {

    /**
     * Creates and returns all voting-related routes.
     */
    public getRouter(): Router {
        const router = Router();

        const submitVoteController =
            new SubmitVoteController();

        // Saves a participant's YES or NO restaurant vote.
        router.post("/:code/votes", (req, res) =>
            submitVoteController.handle(req, res)
        );

        return router;
    }
}