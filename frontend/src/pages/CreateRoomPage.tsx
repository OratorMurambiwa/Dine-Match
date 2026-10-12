import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Header } from "../components/Header";
import { RoomService } from "../services/RoomService";
import { SessionService } from "../services/SessionService";

export function CreateRoomPage() {
    const navigate = useNavigate();

    const [creatorName, setCreatorName] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [cuisine, setCuisine] = useState("Mexican");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (
            !creatorName.trim() ||
            !name.trim() ||
            !location.trim() ||
            !cuisine.trim()
        ) {
            setError("Please complete all fields.");
            return;
        }

        if (
            !Number.isInteger(radiusMiles) ||
            radiusMiles < 1 ||
            radiusMiles > 25
        ) {
            setError("Search radius must be a whole number from 1 to 25.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const roomService = new RoomService();
            const sessionService = new SessionService();

            const room = await roomService.createRoom({
                name: name.trim(),
                location: location.trim(),
                radiusMiles,
                cuisine: cuisine.trim(),
            });

            const participant = await roomService.joinRoom(
                room.code,
                creatorName.trim(),
            );

            sessionService.saveParticipant(room.code, participant);
            navigate(`/room/${room.code}`);
        } catch (error: unknown) {
            if (
                axios.isAxiosError<{ message?: string }>(error) &&
                typeof error.response?.data?.message === "string"
            ) {
                setError(error.response.data.message);
            } else {
                setError("Could not create the room. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
            <Header />

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <fieldset
                    disabled={loading}
                    className="space-y-5 border-0 p-0"
                >
                    <div>
                        <label
                            htmlFor="creatorName"
                            className="mb-2 block font-medium"
                        >
                            Your Name
                        </label>
                        <input
                            id="creatorName"
                            type="text"
                            value={creatorName}
                            onChange={(event) =>
                                setCreatorName(event.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                            placeholder="Orator"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="roomName"
                            className="mb-2 block font-medium"
                        >
                            Room Name
                        </label>
                        <input
                            id="roomName"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-lg border p-3"
                            placeholder="Dinner with friends"
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="mb-2 block font-medium"
                        >
                            Location
                        </label>
                        <input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(event) =>
                                setLocation(event.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                            placeholder="San Francisco, CA"
                            maxLength={255}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="radius"
                            className="mb-2 block font-medium"
                        >
                            Search Radius (miles)
                        </label>
                        <input
                            id="radius"
                            type="number"
                            value={radiusMiles}
                            onChange={(event) =>
                                setRadiusMiles(Number(event.target.value))
                            }
                            className="w-full rounded-lg border p-3"
                            min={1}
                            max={25}
                            step={1}
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="cuisine"
                            className="mb-2 block font-medium"
                        >
                            Cuisine
                        </label>
                        <input
                            id="cuisine"
                            type="text"
                            value={cuisine}
                            onChange={(event) =>
                                setCuisine(event.target.value)
                            }
                            className="w-full rounded-lg border p-3"
                            placeholder="Mexican"
                            maxLength={100}
                            required
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Use a cuisine name such as Mexican, Italian,
                            Chinese, Indian, or Thai.
                        </p>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Room"}
                    </button>
                </fieldset>
            </form>
        </main>
    );
}