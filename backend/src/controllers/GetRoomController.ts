import { Request, Response } from "express";
import { GetRoomService } from "../services/GetRoomService";

export class GetRoomController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            if (typeof code !== "string" || !code.trim()) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const service = new GetRoomService();
            const room = await service.run(
                code.trim().toUpperCase(),
            );

            if (!room) {
                return res.status(404).json({
                    message: "Room not found.",
                });
            }

            return res.status(200).json(room);
        } catch (error) {
            console.error("Could not load the room:", error);

            return res.status(500).json({
                message: "Could not load the room.",
            });
        }
    }
}