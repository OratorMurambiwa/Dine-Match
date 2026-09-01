import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

import "./index.css";


/**
 * Starts the DineMatch React application.
 */
createRoot(
    document.getElementById("root")!,
).render(
    <StrictMode>
        <App />
    </StrictMode>,
);