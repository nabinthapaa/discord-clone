import { defineConfig } from "vite";
import ViteRestart from "vite-plugin-restart";
import fs from "node:fs";
import path from "node:path";

const certPath = path.resolve(__dirname, "./certificates/cert.pem");
const keyPath = path.resolve(__dirname, "./certificates/key.pem");

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    },
  },
  plugins: [
    ViteRestart({
      restart: [
        "public/**/*", // Watch all files in the public directory
      ],
    }),
  ],
});
