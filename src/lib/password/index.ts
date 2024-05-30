import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authLoginRequestSchema } from "../../domain/auth/auth.model";
import { prisma } from "../../prisma";
import { validatePassword } from "./validation";

export const configure = () => {
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
      done(e);
    }
  });

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        session: true,
        passReqToCallback: false,
      },
      async (username, password, done) => {
        const result = authLoginRequestSchema.safeParse({ username, password });
        if (!result.success) {
          console.log(result.error.message);
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
          authLoginRequestSchema.parse({ username, password });
          if (await validatePassword(user, password)) {
            console.log("Valid");
            return done(null, user);
          }
        } catch (e) {
          return done(null, false, {
            message: "Password does not match!",
          });
        }
      }
    )
  );
};
