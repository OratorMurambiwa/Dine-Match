import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export class SocketService {
    private socket: Socket;
    private roomCode: string | null = null;

    public constructor() {
        this.socket = io(
            import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
        );

        this.socket.on("connect", () => {
            if (this.roomCode) {
                this.socket.emit("joinRoom", this.roomCode);
            }
        });
    }

    public joinRoom(roomCode: string): void {
        this.roomCode = roomCode.trim().toUpperCase();

        if (this.socket.connected) {
            this.socket.emit("joinRoom", this.roomCode);
        }
    }

    public onResultsUpdated(callback: () => void): void {
        this.socket.on("resultsUpdated", callback);
    }

    public onParticipantsUpdated(callback: () => void): void {
        this.socket.on("participantUpdated", callback);
    }

    public disconnect(): void {
        this.socket.removeAllListeners();
        this.socket.disconnect();
    }
}