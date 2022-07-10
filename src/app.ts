import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import NotFoundError from "./common/errors/notFoundError";
import { DatabaseConfig } from "./common/database";
import { container } from "./ioc";

export const app = express();

container.registerInstance(
  DatabaseConfig,
  new DatabaseConfig(
    process.env.PGHOST || "localhost",
    process.env.PGPORT || "5432",
    process.env.PGDATABASE || "todos",
    process.env.PGUSER || "postgres",
    process.env.PGPASS || "postgres"
  )
);

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);

app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import("../build/swagger.json")));
});

app.use(function errorHandler(err: unknown, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).send();
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});
