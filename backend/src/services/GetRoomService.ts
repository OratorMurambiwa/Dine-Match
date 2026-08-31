import { RoomRepository } from "../repositories/RoomRepository";


/**
 * Handles the logic for finding one DineMatch room.
 */
export class GetRoomService {

    /**
     * Finds a room using its room code.
     */
    public async run(code: string) {
        const roomRepository = new RoomRepository();

        return roomRepository.findByCode(code);
    }
}