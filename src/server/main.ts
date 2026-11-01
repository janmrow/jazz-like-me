import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildApp } from "./app.js";
import { createDatabaseConnection } from "../db/connection.js";
import { createCatalogueSchema, seedCatalogue } from "../db/catalogue.js";
import { seedAlbums } from "../db/seed.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3000);
const dbPath = process.env.DATABASE_PATH ?? path.resolve("data/jazz-like-me.db");
const webRoot = path.resolve(__dirname, "../../dist/web");

const db = createDatabaseConnection(dbPath);
createCatalogueSchema(db);
seedCatalogue(db, seedAlbums);

const app = buildApp({ db });

if (process.env.SERVE_STATIC !== "false") {
  app.register(fastifyStatic, {
    root: webRoot,
    wildcard: false,
  });

  app.get("/*", async (_request, reply) => {
    return reply.sendFile("index.html");
  });
}

app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening on http://localhost:${port}`);
});
