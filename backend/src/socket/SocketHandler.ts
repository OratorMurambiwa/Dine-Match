import { Server, Socket } from "socket.io";


/**
 * Handles real-time Socket.IO events for DineMatch rooms.
 */
export class SocketHandler {

    private io: Server;


    /**
     * Stores the Socket.IO server used for real-time updates.
     */
    public constructor(io: Server) {
        this.io = io;
    }


    /**
     * Starts listening for new socket connections.
     */
    public initialize(): void {
        this.io.on("connection", (socket: Socket) => {
            this.handleConnection(socket);
        });
    }


    /**
     * Sets up the events used by one connected user.
     */
    private handleConnection(socket: Socket): void {
        // Adds the user to the correct DineMatch room.
        socket.on("joinRoom", (roomCode: string) => {
            socket.join(roomCode);

            this.io.to(roomCode).emit("participantUpdated");
        });

        // Tells everyone in the room that voting changed.
        socket.on("voteSubmitted", (roomCode: string) => {
            this.io.to(roomCode).emit("resultsUpdated");
        });

        // Removes the socket automatically when the user leaves.
        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    }
}