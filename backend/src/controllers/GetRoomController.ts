import { Request, Response } from "express";

import { GetRoomService } from "../services/GetRoomService";


/**
 * Handles requests for getting one DineMatch room.
 */
export class GetRoomController {

    /**
     * Gets a room using the room code from the URL.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            // Make sure a room code was included in the URL.
            if (!code) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const getRoomService = new GetRoomService();

            const room = await getRoomService.run(code);

            if (!room) {
                return res.status(404).json({
                    message: "Room not found.",
                });
            }

            return res.status(200).json(room);

        } catch (error) {
            // Return a general error if the room could not be loaded.
            return res.status(500).json({
                message: "Could not load the room.",
            });
        }
    }
}