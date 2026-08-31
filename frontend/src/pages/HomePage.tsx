import { Link } from "react-router-dom";

import { Header } from "../components/Header";


/**
 * Displays the main landing page for DineMatch.
 */
export function HomePage() {
    return (
        <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
            <Header />

            <div className="mt-10 space-y-4">
                <Link
                    to="/create"
                    className="block rounded-xl bg-black px-6 py-4 text-center font-semibold text-white"
                >
                    Create a DineMatch
                </Link>

                <Link
                    to="/join"
                    className="block rounded-xl border px-6 py-4 text-center font-semibold"
                >
                    Join a Room
                </Link>
            </div>
        </main>
    );
}