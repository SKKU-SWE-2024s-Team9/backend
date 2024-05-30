import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import path from "path";
import filestore from "session-file-store";
import * as uuid from "uuid";
import { prisma } from "./prisma";

import authRouter from "./domain/auth/auth.controller";
import fileRouter from "./domain/file/files.controller";
import userRouter from "./domain/user/users.controller";

async function main() {
  const app = express();
  const port = 3000;

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  const FileStore = filestore(session);
  const sessionInfo: session.SessionOptions = {
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
    store: new FileStore(),
    genid() {
      return uuid.v4();
    },
  };
  if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sessionInfo.cookie!.secure = true;
  }
  app.use(session(sessionInfo));

  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  apiRouter.use("/users", userRouter);
  apiRouter.use("/auth", authRouter);
  apiRouter.use("/files", fileRouter);

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
