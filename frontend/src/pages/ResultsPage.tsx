import { useParams } from "react-router-dom";

import { MatchResultCard } from "../components/MatchResultCard";
import { RoomCodeCard } from "../components/RoomCodeCard";


const results = [
    {
        restaurant: "El Jarrito",
        yesVotes: 4,
        participants: 5,
        matchPercentage: 80,
    },
    {
        restaurant: "Roma Italian Bistro",
        yesVotes: 3,
        participants: 5,
        matchPercentage: 60,
    },
    {
        restaurant: "Restaurant C",
        yesVotes: 1,
        participants: 5,
        matchPercentage: 20,
    },
];


/**
 * Displays the ranked restaurant results for a room.
 */
export function ResultsPage() {
    const { code = "" } = useParams();

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <RoomCodeCard roomCode={code} />

            <div className="mt-10">
                <h1 className="text-3xl font-bold">
                    Your Matches
                </h1>

                <p className="mt-2 text-gray-600">
                    Restaurants ranked by group interest.
                </p>
            </div>

            <div className="mt-8 space-y-4">
                {results.map((result, index) => (
                    <MatchResultCard
                        key={result.restaurant}
                        position={index + 1}
                        restaurant={result.restaurant}
                        yesVotes={result.yesVotes}
                        participants={result.participants}
                        matchPercentage={result.matchPercentage}
                    />
                ))}
            </div>
        </main>
    );
}