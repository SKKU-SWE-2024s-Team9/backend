import type { Request, RequestHandler, Response } from "express";
import { FORBIDDEN } from "./status-code";

export const checkRole = (role: string): RequestHandler => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(FORBIDDEN).send("Forbidden");
    }
  };
};
