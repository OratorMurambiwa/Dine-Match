import { Request, Response } from "express";

import { JoinRoomService } from "../services/JoinRoomService";


/**
 * Handles requests for joining an existing DineMatch room.
 */
export class JoinRoomController {

    /**
     * Adds a participant to the room using their name.
     */
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;
            const { name } = req.body;

            // Make sure the room code and participant name exist.
            if (!code || !name) {
                return res.status(400).json({
                    message: "Room code and name are required.",
                });
            }

            const joinRoomService = new JoinRoomService();

            const participant = await joinRoomService.run({
                code,
                name,
            });

            if (!participant) {
                return res.status(404).json({
                    message: "Room not found.",
                });
            }

            return res.status(201).json(participant);

        } catch (error) {
            // Return a general error if the participant could not join.
            return res.status(500).json({
                message: "Could not join the room.",
            });
        }
    }
}