import { io, Socket } from "socket.io-client";


/**
 * Manages the frontend Socket.IO connection.
 */
export class SocketService {

    private socket: Socket;


    /**
     * Creates the connection to the DineMatch backend.
     */
    public constructor() {
        this.socket = io(
            import.meta.env.VITE_SOCKET_URL
            ?? "http://localhost:3000",
        );
    }


    /**
     * Adds the current user to a real-time room.
     */
    public joinRoom(roomCode: string): void {
        this.socket.emit(
            "joinRoom",
            roomCode,
        );
    }


    /**
     * Tells the room that a new vote was submitted.
     */
    public sendVoteUpdate(roomCode: string): void {
        this.socket.emit(
            "voteSubmitted",
            roomCode,
        );
    }


    /**
     * Runs a function whenever room results change.
     */
    public onResultsUpdated(
        callback: () => void,
    ): void {
        this.socket.on(
            "resultsUpdated",
            callback,
        );
    }


    /**
     * Runs a function whenever room participants change.
     */
    public onParticipantsUpdated(
        callback: () => void,
    ): void {
        this.socket.on(
            "participantUpdated",
            callback,
        );
    }


    /**
     * Removes all active listeners and closes the socket.
     */
    public disconnect(): void {
        this.socket.removeAllListeners();
        this.socket.disconnect();
    }
}