import { type Express } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authLoginRequestSchema } from "../../domain/auth/auth.model";
import { prisma } from "../../prisma";
import { validatePassword } from "./validation";

export const configure = (app: Express) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser<number>(async (userId, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId, activated: true },
      });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        session: true,
        passReqToCallback: false,
      },
      async (username, password, done) => {
        const result = await authLoginRequestSchema.safeParseAsync({
          username,
          password,
        });
        if (!result.success) {
          return done(null, false, {
            message: result.error.message,
          });
        }

        const user = await prisma.user.findFirst({
          where: {
            name: username,
          },
        });

        if (!user) {
          return done(null, false, {
            message: "Email does not exist!",
          });
        }

        try {
          await authLoginRequestSchema.parseAsync({ username, password });
          if (await validatePassword(user, password)) {
            return done(null, user);
          }
        } catch (e) {
          console.error(e);
          return done(null, false, {
            message: "Password does not match!",
          });
        }
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());
};
