const passport = require("passport");
const register = require("./register");
const login = require("./login");

const userRegister = (userRequest, role, res) =>
  register(userRequest, role, res);

const userLogin = (userRequest, role, res) => login(userRequest, role, res);

const userAuth = passport.authenticate("jwt", { session: false });

const checkRole = (roles) => (req, res, next) => {
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();
};

const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  userAuth,
  userLogin,
  userRegister,
  checkRole,
  serializeUser,
};
