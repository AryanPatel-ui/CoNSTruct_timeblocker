import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic, log } from "../server/vite";

// Vercel serverless handler: keep runtime-friendly JS without TypeScript-only declarations
const app: any = express();

app.use(express.json({
  verify: (req: any, _res: any, buf: any) => {
    (req as any).rawBody = buf;
  },
}));
app.use(express.urlencoded({ extended: false }));

app.use((req: any, res: any, next: any) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path && path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    // registerRoutes returns an http.Server in the server implementation; we only need routes
    // registerRoutes may expect a full Express app; call it and ignore the returned server
    try {
      // Some imports may rely on process.env; ensure they can run in serverless environment
      // registerRoutes sets up all /api routes on the passed app
      // We don't await listening since serverless functions are invoked per-request
      // Type: registerRoutes(app) -> Promise<Server>
      // Call it and ignore the returned server
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      await registerRoutes(app);
    } catch (e) {
      console.error("Error registering routes:", e);
    }

    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    try {
      serveStatic(app);
    } catch (e) {
      // serveStatic will throw if dist is not present; in serverless builds Vercel will serve static files itself
      // so swallow this error during build/runtime
      console.warn("serveStatic skipped:", (e as Error).message);
    }

    initialized = true;
  }

  // Delegate the request to the Express app
  app(req, res);
}
