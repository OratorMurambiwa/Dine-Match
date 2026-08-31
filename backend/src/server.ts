import "dotenv/config";

import cors from "cors";
import express, { Application } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";

import { Database } from "./database/Database";
import { DatabaseSetup } from "./database/DatabaseSetup";
import { RestaurantRoutes } from "./routes/RestaurantRoutes";
import { RoomRoutes } from "./routes/RoomRoutes";
import { VoteRoutes } from "./routes/VoteRoutes";
import { SocketHandler } from "./socket/SocketHandler";


/**
 * Starts and manages the DineMatch backend server.
 */
export class Server {

    private app: Application;
    private httpServer: HttpServer;
    private io: SocketServer;
    private port: number;


    /**
     * Creates the Express and Socket.IO servers.
     */
    public constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: "*",
            },
        });

        this.port = Number(process.env.PORT) || 3000;
    }


    /**
     * Configures and starts the backend.
     */
    public async start(): Promise<void> {
        try {
            this.configureMiddleware();
            this.configureRoutes();
            this.configureSockets();

            await this.configureDatabase();

            this.httpServer.listen(this.port, () => {
                console.log(
                    `DineMatch server running on port ${this.port}.`
                );
            });
        } catch (error) {
            console.error("Could not start the DineMatch server.");
            console.error(error);

            process.exit(1);
        }
    }


    /**
     * Adds middleware used by every API request.
     */
    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }


    /**
     * Connects API paths to their route classes.
     */
    private configureRoutes(): void {
        const roomRoutes = new RoomRoutes();
        const restaurantRoutes = new RestaurantRoutes();
        const voteRoutes = new VoteRoutes();

        this.app.get("/api/health", (req, res) => {
            res.status(200).json({
                status: "ok",
            });
        });

        this.app.use(
            "/api/rooms",
            roomRoutes.getRouter()
        );

        this.app.use(
            "/api/rooms",
            restaurantRoutes.getRouter()
        );

        this.app.use(
            "/api/rooms",
            voteRoutes.getRouter()
        );
    }


    /**
     * Starts the real-time Socket.IO event handler.
     */
    private configureSockets(): void {
        const socketHandler = new SocketHandler(this.io);

        socketHandler.initialize();
    }


    /**
     * Checks PostgreSQL and creates the required tables.
     */
    private async configureDatabase(): Promise<void> {
        await Database.testConnection();

        const databaseSetup = new DatabaseSetup();

        await databaseSetup.run();

        console.log("Database connected.");
    }
}


const server = new Server();

server.start();
