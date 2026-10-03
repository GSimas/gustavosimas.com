import { StrictMode } from "react";
import { domAnimation, LazyMotion } from "motion/react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Only the animation features the site uses (enter/exit, variants,
        gestures); `strict` fails loudly if a full `motion.*` sneaks back in. */}
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </StrictMode>,
);
