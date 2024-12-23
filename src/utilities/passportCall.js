import passport from "passport";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      if (error) return next(error);
      if (!user)
        return res.status(401).json({
          error:
            info && info.message
              ? info.message
              : info
              ? info.toString()
              : "Unknown error",
        });
      req.user = user;
      return next();
    })(req, res, next); // función autoinvocada/
  };
};