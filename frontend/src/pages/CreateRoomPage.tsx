import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";
import { RoomService } from "../services/RoomService";
import { SessionService } from "../services/SessionService";


/**
 * Displays the form used to create a new room.
 */
export function CreateRoomPage() {
    const navigate = useNavigate();

    const [creatorName, setCreatorName] = useState("");
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [cuisine, setCuisine] = useState("");
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(2);
    const [minRating, setMinRating] = useState(4);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    /**
     * Creates the room and adds the creator as a participant.
     */
    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (minPrice > maxPrice) {
            setError(
                "Minimum price cannot be higher than maximum price.",
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const roomService = new RoomService();
            const sessionService = new SessionService();

            const room = await roomService.createRoom({
                name,
                location,
                radiusMiles,
                cuisine,
                minPrice,
                maxPrice,
                minRating,
            });

            const participant = await roomService.joinRoom(
                room.code,
                creatorName,
            );

            sessionService.saveParticipant(
                room.code,
                participant,
            );

            navigate(`/room/${room.code}`);

        } catch (error) {
            setError("Could not create the room.");

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
                        value={creatorName}
                        onChange={(event) =>
                            setCreatorName(event.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Orator"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Room Name
                    </label>

                    <input
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Dinner with friends"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Location
                    </label>

                    <input
                        type="text"
                        value={location}
                        onChange={(event) =>
                            setLocation(event.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Grambling, LA"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Search Radius
                    </label>

                    <input
                        type="number"
                        value={radiusMiles}
                        onChange={(event) =>
                            setRadiusMiles(
                                Number(event.target.value),
                            )
                        }
                        className="w-full rounded-lg border p-3"
                        min="1"
                        max="25"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Cuisine
                    </label>

                    <input
                        type="text"
                        value={cuisine}
                        onChange={(event) =>
                            setCuisine(event.target.value)
                        }
                        className="w-full rounded-lg border p-3"
                        placeholder="Mexican"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block font-medium">
                            Minimum Price
                        </label>

                        <select
                            value={minPrice}
                            onChange={(event) =>
                                setMinPrice(
                                    Number(event.target.value),
                                )
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value={1}>$</option>
                            <option value={2}>$$</option>
                            <option value={3}>$$$</option>
                            <option value={4}>$$$$</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Maximum Price
                        </label>

                        <select
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    Number(event.target.value),
                                )
                            }
                            className="w-full rounded-lg border p-3"
                        >
                            <option value={1}>$</option>
                            <option value={2}>$$</option>
                            <option value={3}>$$$</option>
                            <option value={4}>$$$$</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="mb-2 block font-medium">
                        Minimum Rating
                    </label>

                    <input
                        type="number"
                        value={minRating}
                        onChange={(event) =>
                            setMinRating(
                                Number(event.target.value),
                            )
                        }
                        className="w-full rounded-lg border p-3"
                        min="0"
                        max="5"
                        step="0.1"
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
                    className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                    {loading
                        ? "Creating..."
                        : "Create Room"}
                </button>
            </form>
        </main>
    );
}