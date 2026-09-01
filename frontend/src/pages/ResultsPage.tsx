import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MatchResultCard } from "../components/MatchResultCard";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { SocketService } from "../services/SocketService";
import { VoteService } from "../services/VoteService";

import type { MatchResult } from "../types/MatchResult";


/**
 * Displays live ranked restaurant results for a room.
 */
export function ResultsPage() {
    const { code = "" } = useParams();

    const [results, setResults] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /**
     * Loads the newest ranked results from the backend.
     */
    const loadResults = useCallback(async (): Promise<void> => {
        try {
            const voteService = new VoteService();

            const data = await voteService.getResults(code);

            setResults(data);
            setError("");

        } catch (error) {
            setError("Could not load results.");

        } finally {
            setLoading(false);
        }
    }, [code]);


    /**
     * Loads results and listens for live vote changes.
     */
    useEffect(() => {
        const socketService = new SocketService();

        socketService.joinRoom(code);
        socketService.onResultsUpdated(loadResults);

        loadResults();

        return () => {
            socketService.disconnect();
        };
    }, [code, loadResults]);


    if (loading) {
        return (
            <p className="p-10 text-center">
                Loading results...
            </p>
        );
    }


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

            {error && (
                <p className="mt-6 text-red-600">
                    {error}
                </p>
            )}

            <div className="mt-8 space-y-4">
                {results.map((result, index) => (
                    <MatchResultCard
                        key={result.restaurantId}
                        position={index + 1}
                        restaurant={result.restaurant}
                        yesVotes={result.yesVotes}
                        participants={result.participants}
                        matchPercentage={
                            result.matchPercentage
                        }
                    />
                ))}
            </div>
        </main>
    );
}