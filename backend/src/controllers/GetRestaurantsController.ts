import { Request, Response } from "express";
import { GetRestaurantsService } from "../services/GetRestaurantsService";

export class GetRestaurantsController {
    public async handle(req: Request, res: Response): Promise<Response> {
        try {
            const { code } = req.params;

            if (typeof code !== "string" || !code.trim()) {
                return res.status(400).json({
                    message: "Room code is required.",
                });
            }

            const service = new GetRestaurantsService();
            const restaurants = await service.run(
                code.trim().toUpperCase(),
            );

            return res.status(200).json(restaurants);
        } catch (error) {
            console.error("Could not load restaurants:", error);

            return res.status(500).json({
                message: "Could not load restaurants.",
            });
        }
    }
}