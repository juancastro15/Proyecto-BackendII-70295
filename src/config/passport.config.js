import passport from "passport";
import local from "passport-local";
import jwt, { ExtractJwt } from "passport-jwt";
import githubStrategy from "passport-github2";
import UserManager from "../service/users.services.js";
import { usersModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utilities/hashing.utils.js";

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;

const initializatePassport = () => {
  // extración de los datos del usuario desde la cookie
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) =>
            req && req.cookies ? req.cookies["pistachosSanjuaninos"] : null,
        ]),
        secretOrKey: process.env.SECRET_JWT,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload.user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // estrategia para registro de usuarios
  passport.use(
    "register",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firstName, lastName, age, carts, roles } = req.body;
        try {
          const user = await usersModel.findOne({ email: username });
          if (user)
            return done(null, false, { message: "User already exists" });
          const newUser = {
            email: username,
            password: createHash(password),
            firstName,
            lastName,
            age,
            carts,
            roles,
          };
          const result = await usersModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // estrategia para login de usuarios
  passport.use(
    "login",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await usersModel.findOne({ email: username });
          if (!user) return done(null, false, { message: "User not found" });
          if (!isValidPassword(user, password)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

// estrategia para login con Github
passport.use(
  "github",
  new githubStrategy(
    {
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    async (_, __, profile, done) => {
      try {
        const user = await usersModel.findOne({ idGithub: profile._json.id });
        if (user) return done(null, user);

        const newUser = {
          firstName: profile._json.name,
          idGithub: profile._json.id,
        };
        const result = await usersModel.create(newUser);
        return done(null, result);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default initializatePassport;