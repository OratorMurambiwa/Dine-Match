import { Request, Response } from "express";

import { GetRestaurantsService } from "../services/GetRestaurantsService";


/**
 * Handles requests for restaurants that match a room's settings.
 */
export class GetRestaurantsController {

    /**
     * Gets restaurants using the preferences saved for the room.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            // Make sure the request includes a room code.
            if (!code) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const getRestaurantsService = new GetRestaurantsService();

            const restaurants = await getRestaurantsService.run(code);

            return res.status(200).json(restaurants);

        } catch (error) {
            // Return a general error if restaurants could not be loaded.
            return res.status(500).json({
                message: "Could not load restaurants.",
            });
        }
    }
}