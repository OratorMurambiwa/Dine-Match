interface VoteButtonsProps {
    onYes: () => void;
    onNo: () => void;
}


/**
 * Displays the YES and NO buttons used for voting.
 */
export function VoteButtons({
    onYes,
    onNo,
}: VoteButtonsProps) {
    return (
        <div className="flex gap-3">
            <button
                type="button"
                onClick={onNo}
                className="flex-1 rounded-lg border px-4 py-3 font-semibold"
            >
                👎 Pass
            </button>

            <button
                type="button"
                onClick={onYes}
                className="flex-1 rounded-lg bg-black px-4 py-3 font-semibold text-white"
            >
                👍 Yes
            </button>
        </div>
    );
}