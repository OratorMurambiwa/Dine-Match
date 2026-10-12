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

export class Server {
    private app: Application;
    private httpServer: HttpServer;
    private io: SocketServer;
    private port: number;

    public constructor() {
        this.app = express();
        this.httpServer = createServer(this.app);

        this.io = new SocketServer(this.httpServer, {
            cors: {
                origin: "*",
            },
        });

        this.app.set("io", this.io);
        this.port = Number(process.env.PORT) || 3000;
    }

    public async start(): Promise<void> {
        try {
            this.configureMiddleware();
            this.configureRoutes();
            this.configureSockets();

            await this.configureDatabase();

            this.httpServer.listen(this.port, () => {
                console.log(
                    `DineMatch server running on port ${this.port}.`,
                );
            });
        } catch (error) {
            console.error("Could not start the DineMatch server.", error);
            process.exit(1);
        }
    }

    private configureMiddleware(): void {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private configureRoutes(): void {
        this.app.get("/api/health", (_req, res) => {
            res.status(200).json({ status: "ok" });
        });

        this.app.use("/api/rooms", new RoomRoutes().getRouter());
        this.app.use("/api/rooms", new RestaurantRoutes().getRouter());
        this.app.use("/api/rooms", new VoteRoutes().getRouter());
    }

    private configureSockets(): void {
        new SocketHandler(this.io).initialize();
    }

    private async configureDatabase(): Promise<void> {
        await Database.testConnection();
        await new DatabaseSetup().run();
        console.log("Database connected.");
    }
}

const server = new Server();
server.start();