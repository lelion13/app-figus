import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App";
import "./index.css";

// PWA opcional: solo en producción, sin bloquear el uso normal del navegador.
if (import.meta.env.PROD) {
  registerSW({
    immediate: false,
    onRegisterError(error) {
      console.error("SW registration failed:", error);
    },
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
