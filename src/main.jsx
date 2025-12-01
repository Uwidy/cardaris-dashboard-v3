import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ClientPortal from "./ClientPortal.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClientPortal />
  </StrictMode>
);
