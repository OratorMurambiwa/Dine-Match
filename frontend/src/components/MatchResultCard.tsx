interface MatchResultCardProps {
    position: number;
    restaurant: string;
    yesVotes: number;
    participants: number;
    matchPercentage: number;
}


/**
 * Displays one restaurant's ranked voting result.
 */
export function MatchResultCard({
    position,
    restaurant,
    yesVotes,
    participants,
    matchPercentage,
}: MatchResultCardProps) {
    return (
        <article className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        #{position}
                    </p>

                    <h2 className="text-xl font-bold">
                        {restaurant}
                    </h2>
                </div>

                <p className="text-2xl font-bold">
                    {matchPercentage}%
                </p>
            </div>

            <p className="mt-3 text-sm text-gray-600">
                {yesVotes} of {participants} people said yes.
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                    className="h-full bg-black"
                    style={{
                        width: `${matchPercentage}%`,
                    }}
                />
            </div>
        </article>
    );
}