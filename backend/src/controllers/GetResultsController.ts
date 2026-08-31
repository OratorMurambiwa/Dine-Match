import { Request, Response } from "express";

import { GetResultsService } from "../services/GetResultsService";


/**
 * Handles requests for the ranked results of a DineMatch room.
 */
export class GetResultsController {

    /**
     * Gets restaurant vote totals and returns them ranked.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            // Make sure a room code was included.
            if (!code) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const getResultsService = new GetResultsService();

            const results = await getResultsService.run(code);

            return res.status(200).json(results);

        } catch (error) {
            // Return a general error if the results could not be loaded.
            return res.status(500).json({
                message: "Could not load results.",
            });
        }
    }
}