import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MatchResultCard } from "../components/MatchResultCard";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { SocketService } from "../services/SocketService";
import { VoteService } from "../services/VoteService";

import type { MatchResult } from "../types/MatchResult";

export function ResultsPage() {
    const { code = "" } = useParams();
    const roomCode = code.trim().toUpperCase();

    const [results, setResults] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadResults = useCallback(async (): Promise<void> => {
        try {
            const data = await new VoteService().getResults(roomCode);
            setResults(data);
            setError("");
        } catch {
            setError("Could not load results. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [roomCode]);

    useEffect(() => {
        const socketService = new SocketService();

        socketService.onResultsUpdated(() => void loadResults());
        socketService.onParticipantsUpdated(() => void loadResults());
        socketService.joinRoom(roomCode);

        setLoading(true);
        void loadResults();

        return () => {
            socketService.disconnect();
        };
    }, [roomCode, loadResults]);

    if (loading) {
        return <p className="p-10 text-center">Loading results...</p>;
    }

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <RoomCodeCard roomCode={roomCode} />

            <div className="mt-10">
                <h1 className="text-3xl font-bold">Your Matches</h1>
                <p className="mt-2 text-gray-600">
                    Restaurants ranked by group interest.
                </p>
            </div>

            {error && (
                <div role="alert" className="mt-6 text-red-600">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={() => void loadResults()}
                        className="mt-2 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!error && results.length === 0 && (
                <p className="mt-8">No restaurant results yet.</p>
            )}

            <div className="mt-8 space-y-4">
                {results.map((result, index) => (
                    <MatchResultCard
                        key={result.restaurantId}
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