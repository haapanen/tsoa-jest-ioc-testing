import "reflect-metadata";
import { container } from "tsyringe";
import { Database, DatabaseConfig } from "../common/database";

beforeAll(() => {
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
});

afterAll(() => {
  container.resolve(Database).sql.end();
});
