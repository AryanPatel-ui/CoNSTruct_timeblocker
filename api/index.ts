import express from "express";

// Do not import server modules at top-level — they may execute DB/auth code during module
// evaluation and crash the serverless function. We'll dynamically import them inside
// the handler so we can fail gracefully in serverless environments.

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

      // Prefer using server's log function if available; otherwise fallback to console.log
      try {
        // Try to require the logger if it exists
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const viteLogger = require("../server/vite").log;
        if (typeof viteLogger === "function") {
          viteLogger(logLine);
        } else {
          console.log(logLine);
        }
      } catch (e) {
        console.log(logLine);
      }
    }
  });

  next();
});

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    try {
      // Dynamically import server modules to avoid running DB/auth code at module load time
      // This import may still throw if required env vars are missing; we catch and continue
      // so the function can still respond to requests that don't need the full backend.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const routesModule = await import("../server/routes");
      if (routesModule && typeof routesModule.registerRoutes === "function") {
        try {
          // registerRoutes may return an http.Server; we ignore it
          await routesModule.registerRoutes(app);
        } catch (e) {
          console.error("registerRoutes failed:", e);
        }
      }

      // Try to import serveStatic if present
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const viteModule = await import("../server/vite");
        if (viteModule && typeof viteModule.serveStatic === "function") {
          try {
            viteModule.serveStatic(app);
          } catch (e: any) {
            console.warn("serveStatic error (ignored):", (e && e.message) || e);
          }
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      console.error("Dynamic server import failed:", e);
    }

    app.use((err: any, _req: any, res: any, _next: any) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    initialized = true;
  }

  // Delegate the request to the Express app
  app(req, res);
}
