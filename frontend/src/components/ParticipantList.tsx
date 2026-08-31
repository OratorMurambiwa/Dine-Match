interface ParticipantListProps {
    participants: string[];
}


/**
 * Displays everyone who has joined the room.
 */
export function ParticipantList({
    participants,
}: ParticipantListProps) {
    return (
        <div>
            <h2 className="text-lg font-semibold">
                Participants
            </h2>

            <div className="mt-3 flex flex-wrap gap-2">
                {participants.map((participant) => (
                    <span
                        key={participant}
                        className="rounded-full border px-3 py-1"
                    >
                        {participant}
                    </span>
                ))}
            </div>
        </div>
    );
}