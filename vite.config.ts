import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { Readable } from "node:stream";
import { handleTavo } from "./netlify/functions/tavo";

// In dev, serve Tavo's Netlify function from the Vite server itself, so
// `npm run dev` is enough. DEEPSEEK_API_KEY comes from .env and stays here,
// on the server; only VITE_-prefixed variables ever reach the browser.
function tavoDev(): Plugin {
  return {
    name: "tavo-dev",
    configureServer(server) {
      server.middlewares.use("/api/tavo", async (req, res) => {
        const controller = new AbortController();
        res.on("close", () => controller.abort());
        const body = req.method === "POST" ? Readable.toWeb(req) as ReadableStream : undefined;
        const request = new Request(`http://${req.headers.host}${req.originalUrl}`, {
          method: req.method,
          headers: req.headers as Record<string, string>,
          body,
          signal: controller.signal,
          // @ts-expect-error Node's fetch needs this for a streamed request body.
          duplex: "half",
        });
        const response = await handleTavo(request);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        if (response.body) Readable.fromWeb(response.body as never).pipe(res);
        else res.end();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return { plugins: [react(), tavoDev()] };
});
