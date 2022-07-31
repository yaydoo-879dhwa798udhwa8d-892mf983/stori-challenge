require("dotenv").config();

const CONFIG = {
  DATABASES: {
    postgresql: {
      DB_HOST: <string>process.env.DB_HOST,
      DB_PORT: <number>(<unknown>process.env.DB_PORT),
      DB_USERNAME: <string>process.env.DB_USERNAME,
      DB_PASSWORD: <string>process.env.DB_PASSWORD,
      DB_NAME: <string>process.env.DB_NAME,
    },
  },
};

export { CONFIG };
