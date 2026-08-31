import { VoteButtons } from "./VoteButtons";


interface RestaurantCardProps {
    name: string;
    address: string;
    rating: number | null;
    priceLevel: number | null;
    onYes: () => void;
    onNo: () => void;
}


/**
 * Displays one restaurant and its voting controls.
 */
export function RestaurantCard({
    name,
    address,
    rating,
    priceLevel,
    onYes,
    onNo,
}: RestaurantCardProps) {
    return (
        <article className="rounded-xl border p-6 shadow-sm">
            <h2 className="text-2xl font-bold">
                {name}
            </h2>

            <p className="mt-2 text-gray-600">
                {address}
            </p>

            <div className="my-4 flex gap-4">
                <span>
                    ⭐ {rating ?? "No rating"}
                </span>

                <span>
                    💰{" "}
                    {priceLevel
                        ? "$".repeat(priceLevel)
                        : "Unknown"}
                </span>
            </div>

            <VoteButtons
                onYes={onYes}
                onNo={onNo}
            />
        </article>
    );
}