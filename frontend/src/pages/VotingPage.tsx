import { useState } from "react";
import { useParams } from "react-router-dom";

import { ParticipantList } from "../components/ParticipantList";
import { RestaurantCard } from "../components/RestaurantCard";
import { RoomCodeCard } from "../components/RoomCodeCard";


const restaurants = [
    {
        id: 1,
        name: "El Jarrito",
        address: "Ruston, LA",
        rating: 4.6,
        priceLevel: 2,
    },
    {
        id: 2,
        name: "Roma Italian Bistro",
        address: "Ruston, LA",
        rating: 4.4,
        priceLevel: 2,
    },
];


/**
 * Displays restaurants and allows participants to vote.
 */
export function VotingPage() {
    const { code = "" } = useParams();

    const [currentIndex, setCurrentIndex] = useState(0);

    const restaurant = restaurants[currentIndex];

    /**
     * Saves a temporary YES vote and shows the next restaurant.
     */
    function handleYes(): void {
        console.log("YES", restaurant.id);

        moveToNextRestaurant();
    }


    /**
     * Saves a temporary NO vote and shows the next restaurant.
     */
    function handleNo(): void {
        console.log("NO", restaurant.id);

        moveToNextRestaurant();
    }


    /**
     * Moves to the next available restaurant.
     */
    function moveToNextRestaurant(): void {
        if (currentIndex < restaurants.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <RoomCodeCard roomCode={code} />

            <div className="mt-8">
                <ParticipantList
                    participants={[
                        "Orator",
                        "Sarah",
                        "John",
                    ]}
                />
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
                Restaurant {currentIndex + 1} of {restaurants.length}
            </p>

            <div className="mt-4">
                <RestaurantCard
                    name={restaurant.name}
                    address={restaurant.address}
                    rating={restaurant.rating}
                    priceLevel={restaurant.priceLevel}
                    onYes={handleYes}
                    onNo={handleNo}
                />
            </div>
        </main>
    );
}