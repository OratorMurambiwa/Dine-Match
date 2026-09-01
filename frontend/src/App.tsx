import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";

import { CreateRoomPage } from "./pages/CreateRoomPage";
import { HomePage } from "./pages/HomePage";
import { JoinRoomPage } from "./pages/JoinRoomPage";
import { ResultsPage } from "./pages/ResultsPage";
import { VotingPage } from "./pages/VotingPage";


/**
 * Defines the main routes used by the DineMatch frontend.
 */
export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/create"
                    element={<CreateRoomPage />}
                />

                <Route
                    path="/join"
                    element={<JoinRoomPage />}
                />

                <Route
                    path="/room/:code"
                    element={<VotingPage />}
                />

                <Route
                    path="/room/:code/results"
                    element={<ResultsPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}