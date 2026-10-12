import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { MatchResultCard } from "../components/MatchResultCard";
import { RoomCodeCard } from "../components/RoomCodeCard";
import { SessionService } from "../services/SessionService";
import { SocketService } from "../services/SocketService";
import { VoteService } from "../services/VoteService";

import type { MatchResult } from "../types/MatchResult";

export function ResultsPage() {
    const { code = "" } = useParams();
    const roomCode = code.trim().toUpperCase();

    const [results, setResults] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const participant = new SessionService().getParticipant(roomCode);

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

    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-10">
            <nav
                aria-label="Results navigation"
                className="mb-8 flex flex-wrap items-center justify-between gap-3"
            >
                <Link
                    to="/"
                    className="rounded-lg border px-4 py-2 font-medium"
                >
                    ← Home
                </Link>

                {participant && (
                    <Link
                        to={`/room/${roomCode}`}
                        className="rounded-lg bg-black px-4 py-2 font-semibold text-white"
                    >
                        Change my votes
                    </Link>
                )}
            </nav>

            <RoomCodeCard roomCode={roomCode} />

            <div className="mt-10">
                <h1 className="text-3xl font-bold">Your Matches</h1>
                <p className="mt-2 text-gray-600">
                    Restaurants ranked by group interest.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Match percentages include everyone who has joined,
                    even if they have not voted yet.
                </p>
            </div>

            {loading && (
                <p role="status" className="mt-8">
                    Loading results...
                </p>
            )}

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

            {!loading && !error && results.length === 0 && (
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