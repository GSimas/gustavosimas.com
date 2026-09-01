import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      // `vite dev` has no Netlify runtime, so run the same handler in-process.
      name: "netlify-functions-dev",
      configureServer(server) {
        server.middlewares.use("/.netlify/functions/opensky", async (_request, response) => {
          const { default: handler } = await import("./netlify/functions/opensky.mjs");
          const result = await handler();
          response.statusCode = result.status;
          response.setHeader("content-type", "application/json");
          response.end(await result.text());
        });
      },
    },
  ],
});
