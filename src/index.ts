import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import { prisma } from "./prisma";

import userRouter from "./domain/user/users.controller";

async function main() {
  const app = express();
  const port = 3000;

  app.use(helmet());
  app.use(express.json());

  app.use("/api/users", userRouter);

  app.all("*", (req, res) => {
    res.status(404).json({ error: `${req.originalUrl} not found.` });
  });

  app
    .listen(port, () => {})
    .on("close", () => {
      prisma.$disconnect();
    });
}

main()
  .then(async () => {
    await prisma.$connect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
