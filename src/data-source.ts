import "reflect-metadata";
import { DataSource } from "typeorm";
import { Transaction, Account } from "./entities";

import { CONFIG } from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: CONFIG.DATABASES.postgresql.DB_HOST,
  port: CONFIG.DATABASES.postgresql.DB_PORT,
  username: CONFIG.DATABASES.postgresql.DB_USERNAME,
  password: CONFIG.DATABASES.postgresql.DB_PASSWORD,
  database: CONFIG.DATABASES.postgresql.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Transaction, Account],
  migrations: [],
  subscribers: [],
});
