import { Router } from "express";

import { CreateRoomController } from "../controllers/CreateRoomController";
import { GetRoomController } from "../controllers/GetRoomController";
import { JoinRoomController } from "../controllers/JoinRoomController";
import { GetResultsController } from "../controllers/GetResultsController";


/**
 * Defines API routes used for DineMatch rooms.
 */
export class RoomRoutes {

    /**
     * Creates and returns all room-related routes.
     */
    public getRouter(): Router {
        const router = Router();

        const createRoomController = new CreateRoomController();
        const getRoomController = new GetRoomController();
        const joinRoomController = new JoinRoomController();
        const getResultsController = new GetResultsController();

        // Creates a new DineMatch room.
        router.post("/", (req, res) =>
            createRoomController.handle(req, res)
        );

        // Gets one room using its room code.
        router.get("/:code", (req, res) =>
            getRoomController.handle(req, res)
        );

        // Adds a participant to an existing room.
        router.post("/:code/join", (req, res) =>
            joinRoomController.handle(req, res)
        );

        // Gets the ranked voting results for a room.
        router.get("/:code/results", (req, res) =>
            getResultsController.handle(req, res)
        );

        return router;
    }
}