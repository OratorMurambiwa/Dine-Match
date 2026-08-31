import { Router } from "express";

import {
    GetRestaurantsController,
} from "../controllers/GetRestaurantsController";


/**
 * Defines API routes used for restaurant results.
 */
export class RestaurantRoutes {

    /**
     * Creates and returns all restaurant-related routes.
     */
    public getRouter(): Router {
        const router = Router();

        const getRestaurantsController =
            new GetRestaurantsController();

        // Gets restaurants linked to a DineMatch room.
        router.get("/:code/restaurants", (req, res) =>
            getRestaurantsController.handle(req, res)
        );

        return router;
    }
}