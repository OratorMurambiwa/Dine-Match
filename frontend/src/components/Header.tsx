/**
 * Displays the main DineMatch title and description.
 */
export function Header() {
    return (
        <header className="text-center">
            <h1 className="text-3xl font-bold">
                DineMatch
            </h1>

            <p className="mt-2 text-gray-600">
                Find somewhere everyone wants to eat.
            </p>
        </header>
    );
}