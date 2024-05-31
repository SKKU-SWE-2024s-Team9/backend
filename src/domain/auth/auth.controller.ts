import express, { Request, Response } from "express";
import passport, { AuthenticateCallback } from "passport";
import { z } from "zod";
import { authLoginRequestSchema } from "./auth.model";

const router = express.Router();

type AuthLoginRequest = z.infer<typeof authLoginRequestSchema>;
router.post("/login", (req: Request<{}, {}, AuthLoginRequest>, res, next) => {
  const authLogin: AuthenticateCallback = (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).end();
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).end();
    });
  };
  passport.authenticate("login", authLogin)(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout(() => {
    res.end();
  });
});

export default router;
