import type { Participant } from "../types/Participant";


/**
 * Stores the current participant inside the browser session.
 */
export class SessionService {

    /**
     * Saves the participant for the current room.
     */
    public saveParticipant(
        roomCode: string,
        participant: Participant,
    ): void {
        sessionStorage.setItem(
            `dinematch-${roomCode}-participant`,
            JSON.stringify(participant),
        );
    }


    /**
     * Gets the saved participant for the current room.
     */
    public getParticipant(
        roomCode: string,
    ): Participant | null {
        const savedParticipant = sessionStorage.getItem(
            `dinematch-${roomCode}-participant`,
        );

        if (!savedParticipant) {
            return null;
        }

        return JSON.parse(savedParticipant) as Participant;
    }
}