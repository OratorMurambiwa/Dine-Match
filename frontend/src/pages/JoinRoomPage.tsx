import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { RoomService } from "../services/RoomService";
import { SessionService } from "../services/SessionService";


/**
 * Displays the form used to join an existing room.
 */
export function JoinRoomPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    /**
     * Adds the participant to the requested room.
     */
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        const code = roomCode.trim().toUpperCase();

        try {
            setLoading(true);
            setError("");

            const roomService = new RoomService();
            const sessionService = new SessionService();

            const participant = await roomService.joinRoom(
                code,
                name,
            );

            sessionService.saveParticipant(
                code,
                participant,
            );

            navigate(`/room/${code}`);

        } catch (error) {
            setError("Could not join that room.");

        } finally {
            setLoading(false);
        }
    }


    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
            <Header />

            <form
                onSubmit={handleSubmit}
                className="mt-10 space-y-5"
            >
                <div>
                    <label className="mb-2 block font-medium">
                        Your Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Sarah"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Room Code
                    </label>

                    <input
                        type="text"
                        value={roomCode}
                        onChange={(event) =>
                            setRoomCode(event.target.value)
                        }
                        className="w-full rounded-lg border p-3 uppercase"
                        placeholder="H7K29"
                        maxLength={5}
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white"
                >
                    {loading
                        ? "Joining..."
                        : "Join Room"}
                </button>
            </form>
        </main>
    );
}