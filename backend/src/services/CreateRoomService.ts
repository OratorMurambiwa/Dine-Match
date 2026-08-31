import { RoomRepository } from "../repositories/RoomRepository";


interface CreateRoomData {
    name: string;
    location: string;
    radiusMiles: number;
    cuisine: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
}


/**
 * Handles the logic for creating a new DineMatch room.
 */
export class CreateRoomService {

    /**
     * Creates a room with a unique room code.
     */
    public async run(data: CreateRoomData) {
        const roomRepository = new RoomRepository();

        const code = this.generateRoomCode();

        return roomRepository.create({
            ...data,
            code,
        });
    }


    /**
     * Creates a short code that users can share.
     */
    private generateRoomCode(): string {
        const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let code = "";

        for (let index = 0; index < 5; index++) {
            const position = Math.floor(
                Math.random() * characters.length
            );

            code += characters[position];
        }

        return code;
    }
}