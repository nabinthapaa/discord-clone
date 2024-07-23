import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiresIn: +process.env.JWT_ACCESS_EXPIRES_IN! || 30000,
    refreshExpiresIn: +process.env.JWT_REFRESH_EXPIRES_IN! || 300000,
  },
  database: {
    client: process.env.DB_CLIENT,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
};

export default config;
