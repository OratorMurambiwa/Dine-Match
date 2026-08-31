import { ParticipantRepository } from "../repositories/ParticipantRepository";
import { RoomRepository } from "../repositories/RoomRepository";


interface JoinRoomData {
    code: string;
    name: string;
}


/**
 * Handles the logic for joining a DineMatch room.
 */
export class JoinRoomService {

    /**
     * Checks the room and adds the new participant.
     */
    public async run(data: JoinRoomData) {
        const roomRepository = new RoomRepository();
        const participantRepository = new ParticipantRepository();

        const room = await roomRepository.findByCode(data.code);

        // Stop if the room code does not exist.
        if (!room) {
            return null;
        }

        return participantRepository.create({
            roomId: room.id,
            name: data.name,
        });
    }
}