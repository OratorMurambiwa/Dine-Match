interface RoomCodeCardProps {
    roomCode: string;
}


/**
 * Displays the room code users can share with friends.
 */
export function RoomCodeCard({
    roomCode,
}: RoomCodeCardProps) {
    return (
        <div className="rounded-xl border p-6 text-center">
            <p className="text-sm text-gray-500">
                Room Code
            </p>

            <p className="mt-2 text-3xl font-bold tracking-widest">
                {roomCode}
            </p>

            <p className="mt-2 text-sm text-gray-500">
                Share this code with your friends.
            </p>
        </div>
    );
}