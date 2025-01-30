export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.roles.some((roleUser) => roleUser === role)) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You don't have permission to access this resource" });
  };
};