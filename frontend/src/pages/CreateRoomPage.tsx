import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "../components/Header";


/**
 * Displays the form used to create a new room.
 */
export function CreateRoomPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [radiusMiles, setRadiusMiles] = useState(10);
    const [cuisine, setCuisine] = useState("");
    const [minRating, setMinRating] = useState(4);

    /**
     * Handles the room creation form.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        console.log({
            name,
            location,
            radiusMiles,
            cuisine,
            minRating,
        });

        // We will replace this with the real API request.
        navigate("/room/TEST1");
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
                            setRadiusMiles(Number(event.target.value))
                        }
                        className="w-full rounded-lg border p-3"
                        min="1"
                        max="50"
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

                <div>
                    <label className="mb-2 block font-medium">
                        Minimum Rating
                    </label>

                    <input
                        type="number"
                        value={minRating}
                        onChange={(event) =>
                            setMinRating(Number(event.target.value))
                        }
                        className="w-full rounded-lg border p-3"
                        min="0"
                        max="5"
                        step="0.1"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white"
                >
                    Create Room
                </button>
            </form>
        </main>
    );
}