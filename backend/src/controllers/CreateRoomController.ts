import { Request, Response } from "express";

import { CreateRoomService } from "../services/CreateRoomService";


/**
 * Handles requests for creating a new DineMatch room.
 */
export class CreateRoomController {

    /**
     * Gets the room settings, creates the room, and returns its code.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const {
                name,
                location,
                radiusMiles,
                cuisine,
                minPrice,
                maxPrice,
                minRating,
            } = req.body;

            // Make sure the main room settings were provided.
            if (!name || !location || !radiusMiles || !cuisine) {
                return res.status(400).json({
                    message: "Missing required room information.",
                });
            }

            const createRoomService = new CreateRoomService();

            const room = await createRoomService.run({
                name,
                location,
                radiusMiles,
                cuisine,
                minPrice,
                maxPrice,
                minRating,
            });

            return res.status(201).json(room);

        } catch (error) {
            // Return a general error if the room could not be created.
            return res.status(500).json({
                message: "Could not create the room.",
            });
        }
    }
}