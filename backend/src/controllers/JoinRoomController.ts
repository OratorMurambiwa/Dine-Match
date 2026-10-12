import { Request, Response } from "express";
import { Server as SocketServer } from "socket.io";
import { JoinRoomService } from "../services/JoinRoomService";

export class JoinRoomController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;
            const { name } = req.body ?? {};

            if (
                typeof code !== "string" ||
                !code.trim() ||
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 100
            ) {
                return res.status(400).json({
                    message:
                        "A room code and a name of 1–100 characters are required.",
                });
            }

            const roomCode = code.trim().toUpperCase();
            const service = new JoinRoomService();

            const participant = await service.run({
                code: roomCode,
                name: name.trim(),
            });

            if (!participant) {
                return res.status(404).json({
                    message: "Room not found.",
                });
            }

            const io: SocketServer = req.app.get("io");
            io.to(roomCode).emit("participantUpdated");
            io.to(roomCode).emit("resultsUpdated");

            return res.status(201).json(participant);
        } catch (error) {
            console.error("Could not join the room:", error);

            return res.status(500).json({
                message: "Could not join the room.",
            });
        }
    }
}