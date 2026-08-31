import { ApiClient } from "./ApiClient";

import type { Participant } from "../types/Participant";
import type { Room } from "../types/Room";


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
 * Handles frontend requests related to DineMatch rooms.
 */
export class RoomService {

    /**
     * Sends room settings to the backend and creates a room.
     */
    public async createRoom(data: CreateRoomData): Promise<Room> {
        const client = ApiClient.getClient();

        const response = await client.post<Room>(
            "/rooms",
            data,
        );

        return response.data;
    }


    /**
     * Gets one room using its shareable room code.
     */
    public async getRoom(code: string): Promise<Room> {
        const client = ApiClient.getClient();

        const response = await client.get<Room>(
            `/rooms/${code}`,
        );

        return response.data;
    }


    /**
     * Adds a participant to an existing room.
     */
    public async joinRoom(
        code: string,
        name: string,
    ): Promise<Participant> {
        const client = ApiClient.getClient();

        const response = await client.post<Participant>(
            `/rooms/${code}/join`,
            {
                name,
            },
        );

        return response.data;
    }
}