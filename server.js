import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const host = "0.0.0.0";
const port = Number.parseInt(process.env.PORT ?? "10000", 10);
const siteDirectory = fileURLToPath(new URL("./site/", import.meta.url));

const routes = new Map([
  [
    "/",
    {
      file: "index.html",
      contentType: "text/html; charset=utf-8",
      cacheControl: "no-cache",
    },
  ],
  [
    "/index.html",
    {
      file: "index.html",
      contentType: "text/html; charset=utf-8",
      cacheControl: "no-cache",
    },
  ],
  [
    "/styles.css",
    {
      file: "styles.css",
      contentType: "text/css; charset=utf-8",
      cacheControl: "public, max-age=3600",
    },
  ],
  [
    "/scratch-project.sb3",
    {
      file: "scratch-project.sb3",
      contentType: "application/octet-stream",
      cacheControl: "public, max-age=3600",
      contentDisposition: 'attachment; filename="scratch-project.sb3"',
    },
  ],
]);

function sendText(response, statusCode, message, method) {
  const body = `${message}\n`;

  response.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });

  response.end(method === "HEAD" ? undefined : body);
}

const server = createServer(async (request, response) => {
  const method = request.method ?? "GET";

  if (method !== "GET" && method !== "HEAD") {
    response.setHeader("Allow", "GET, HEAD");
    sendText(response, 405, "Method Not Allowed", method);
    return;
  }

  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

  if (pathname === "/health") {
    sendText(response, 200, "ok", method);
    return;
  }

  const route = routes.get(pathname);

  if (!route) {
    sendText(response, 404, "Not Found", method);
    return;
  }

  const filePath = fileURLToPath(new URL(route.file, `file://${siteDirectory}/`));

  try {
    const fileStats = await stat(filePath);
    const headers = {
      "Content-Type": route.contentType,
      "Content-Length": fileStats.size,
      "Cache-Control": route.cacheControl,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    };

    if (route.contentDisposition) {
      headers["Content-Disposition"] = route.contentDisposition;
    }

    response.writeHead(200, headers);

    if (method === "HEAD") {
      response.end();
      return;
    }

    const stream = createReadStream(filePath);
    stream.on("error", () => {
      if (!response.headersSent) {
        sendText(response, 500, "Internal Server Error", method);
      } else {
        response.destroy();
      }
    });
    stream.pipe(response);
  } catch {
    sendText(response, 404, "Not Found", method);
  }
});

server.listen(port, host, () => {
  console.log(`Download1 listening on http://${host}:${port}`);
});
