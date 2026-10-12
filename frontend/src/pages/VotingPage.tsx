import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RestaurantCard } from "../components/RestaurantCard";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { RestaurantService } from "../services/RestaurantService";
import { SessionService } from "../services/SessionService";
import { SocketService } from "../services/SocketService";
import { VoteService } from "../services/VoteService";

import type { Restaurant } from "../types/Restaurant";

export function VotingPage() {
    const { code = "" } = useParams();
    const roomCode = code.trim().toUpperCase();
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [voteError, setVoteError] = useState("");

    const voteInFlight = useRef(false);

    useEffect(() => {
        let active = true;

        const participant = new SessionService().getParticipant(roomCode);

        if (!participant) {
            navigate("/join", { replace: true });
            return;
        }

        const socketService = new SocketService();
        socketService.joinRoom(roomCode);

        setLoading(true);
        setLoadError("");
        setVoteError("");
        setCurrentIndex(0);

        async function loadRestaurants(): Promise<void> {
            try {
                const data = await new RestaurantService()
                    .getRestaurants(roomCode);

                if (active) {
                    setRestaurants(data);
                }
            } catch {
                if (active) {
                    setLoadError("Could not load restaurants.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadRestaurants();

        return () => {
            active = false;
            socketService.disconnect();
        };
    }, [roomCode, navigate]);

    async function submitVote(vote: boolean): Promise<void> {
        const restaurant = restaurants[currentIndex];

        if (!restaurant || voteInFlight.current) {
            return;
        }

        const participant = new SessionService().getParticipant(roomCode);

        if (!participant) {
            navigate("/join");
            return;
        }

        voteInFlight.current = true;
        setSubmitting(true);
        setVoteError("");

        try {
            await new VoteService().submitVote(roomCode, {
                participantId: participant.id,
                restaurantId: restaurant.id,
                vote,
            });

            // The backend broadcasts the update after saving the vote.
            if (currentIndex < restaurants.length - 1) {
                setCurrentIndex((index) => index + 1);
            } else {
                navigate(`/room/${roomCode}/results`);
            }
        } catch {
            setVoteError("Could not save your vote. Please try again.");
        } finally {
            voteInFlight.current = false;
            setSubmitting(false);
        }
    }

    if (loading) {
        return <p className="p-10 text-center">Loading restaurants...</p>;
    }

    if (loadError) {
        return <p className="p-10 text-center">{loadError}</p>;
    }

    if (restaurants.length === 0) {
        return <p className="p-10 text-center">No restaurants found.</p>;
    }

    const restaurant = restaurants[currentIndex];

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <RoomCodeCard roomCode={roomCode} />

            <p className="mt-8 text-center text-sm text-gray-500">
                Restaurant {currentIndex + 1} of {restaurants.length}
            </p>

            {voteError && (
                <p role="alert" className="mt-4 text-center text-red-600">
                    {voteError}
                </p>
            )}

            <fieldset
                disabled={submitting}
                aria-busy={submitting}
                className="mt-4 border-0 p-0 disabled:opacity-60"
            >
                <RestaurantCard
                    name={restaurant.name}
                    address={restaurant.address}
                    rating={restaurant.rating}
                    priceLevel={restaurant.priceLevel}
                    onYes={() => void submitVote(true)}
                    onNo={() => void submitVote(false)}
                />
            </fieldset>

            {submitting && (
                <p role="status" className="mt-3 text-center text-sm">
                    Saving vote...
                </p>
            )}
        </main>
    );
}