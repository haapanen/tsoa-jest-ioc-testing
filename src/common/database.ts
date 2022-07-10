import { Lifecycle, scoped } from "tsyringe";
import postgres from "postgres";

export class DatabaseConfig {
  constructor(
    public host: string,
    public port: string,
    public database: string,
    public username: string,
    public password: string
  ) {}
}

@scoped(Lifecycle.ContainerScoped)
export class Database {
  sql: postgres.Sql<{}>;

  constructor(private readonly databaseConfig: DatabaseConfig) {
    this.sql = postgres({
      host: databaseConfig.host,
      port: parseInt(databaseConfig.port),
      database: databaseConfig.database,
      username: databaseConfig.username,
      password: databaseConfig.password,
    });
  }
}
