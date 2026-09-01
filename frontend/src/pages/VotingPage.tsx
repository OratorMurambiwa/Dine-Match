import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { RestaurantCard } from "../components/RestaurantCard";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { RestaurantService } from "../services/RestaurantService";
import { SessionService } from "../services/SessionService";
import { SocketService } from "../services/SocketService";
import { VoteService } from "../services/VoteService";

import type { Restaurant } from "../types/Restaurant";


/**
 * Displays restaurants and allows participants to vote.
 */
export function VotingPage() {
    const { code = "" } = useParams();
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /**
     * Loads restaurants and joins the real-time room.
     */
    useEffect(() => {
        const restaurantService = new RestaurantService();
        const socketService = new SocketService();

        async function loadRestaurants(): Promise<void> {
            try {
                const data =
                    await restaurantService.getRestaurants(code);

                setRestaurants(data);

            } catch (error) {
                setError("Could not load restaurants.");

            } finally {
                setLoading(false);
            }
        }

        socketService.joinRoom(code);

        loadRestaurants();

        return () => {
            socketService.disconnect();
        };
    }, [code]);


    /**
     * Sends the participant's vote to the backend.
     */
    async function submitVote(vote: boolean): Promise<void> {
        const restaurant = restaurants[currentIndex];

        if (!restaurant) {
            return;
        }

        const sessionService = new SessionService();
        const participant =
            sessionService.getParticipant(code);

        if (!participant) {
            navigate("/join");
            return;
        }

        try {
            const voteService = new VoteService();
            const socketService = new SocketService();

            await voteService.submitVote(code, {
                participantId: participant.id,
                restaurantId: restaurant.id,
                vote,
            });

            socketService.sendVoteUpdate(code);
            socketService.disconnect();

            moveToNextRestaurant();

        } catch (error) {
            setError("Could not save your vote.");
        }
    }


    /**
     * Moves forward or opens the final results.
     */
    function moveToNextRestaurant(): void {
        if (currentIndex < restaurants.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return;
        }

        navigate(`/room/${code}/results`);
    }


    if (loading) {
        return (
            <p className="p-10 text-center">
                Loading restaurants...
            </p>
        );
    }


    if (error) {
        return (
            <p className="p-10 text-center">
                {error}
            </p>
        );
    }


    if (restaurants.length === 0) {
        return (
            <p className="p-10 text-center">
                No restaurants found.
            </p>
        );
    }

    const restaurant = restaurants[currentIndex];


    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <RoomCodeCard roomCode={code} />

            <p className="mt-8 text-center text-sm text-gray-500">
                Restaurant {currentIndex + 1} of{" "}
                {restaurants.length}
            </p>

            <div className="mt-4">
                <RestaurantCard
                    name={restaurant.name}
                    address={restaurant.address}
                    rating={restaurant.rating}
                    priceLevel={restaurant.priceLevel}
                    onYes={() => submitVote(true)}
                    onNo={() => submitVote(false)}
                />
            </div>
        </main>
    );
}