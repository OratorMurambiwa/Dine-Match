import { Request, Response } from "express";
import { SubmitVoteService } from "../services/SubmitVoteService";

export class SubmitVoteController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;
            const {
                participantId,
                restaurantId,
                vote,
            } = req.body ?? {};

            if (
                typeof code !== "string" ||
                !code.trim() ||
                !Number.isInteger(participantId) ||
                participantId <= 0 ||
                !Number.isInteger(restaurantId) ||
                restaurantId <= 0 ||
                typeof vote !== "boolean"
            ) {
                return res.status(400).json({
                    message: "Invalid vote information.",
                });
            }

            const service = new SubmitVoteService();

            const savedVote = await service.run({
                code: code.trim().toUpperCase(),
                participantId,
                restaurantId,
                vote,
            });

            return res.status(201).json(savedVote);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Room not found.") {
                    return res.status(404).json({
                        message: error.message,
                    });
                }

                if (
                    error.message ===
                    "Participant or restaurant does not belong to this room."
                ) {
                    return res.status(400).json({
                        message: error.message,
                    });
                }
            }

            console.error("Could not save the vote:", error);

            return res.status(500).json({
                message: "Could not save the vote.",
            });
        }
    }
}