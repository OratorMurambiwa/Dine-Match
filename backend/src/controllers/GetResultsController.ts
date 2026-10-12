import { Request, Response } from "express";
import { GetResultsService } from "../services/GetResultsService";

export class GetResultsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            if (typeof code !== "string" || !code.trim()) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const service = new GetResultsService();
            const results = await service.run(
                code.trim().toUpperCase(),
            );

            return res.status(200).json(results);
        } catch (error) {
            console.error("Could not load results:", error);

            return res.status(500).json({
                message: "Could not load results.",
            });
        }
    }
}