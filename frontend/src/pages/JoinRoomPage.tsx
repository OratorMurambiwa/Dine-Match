import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";


/**
 * Displays the form used to join an existing room.
 */
export function JoinRoomPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [roomCode, setRoomCode] = useState("");

    /**
     * Handles the room joining form.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        const code = roomCode.trim().toUpperCase();

        console.log({
            name,
            roomCode: code,
        });

        // We will replace this with the real API request.
        navigate(`/room/${code}`);
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

                <button
                    type="submit"
                    className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white"
                >
                    Join Room
                </button>
            </form>
        </main>
    );
}