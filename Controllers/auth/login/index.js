// Modules
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// Imports
const { SECRET, TOKEN_EXPIRATION } = require("../../../config");
const User = require("../../../models/User");
const { loginSchema } = require("../validate");

/**
 * Contains messages returned by the server when exceptions are catched.
 * @const MSG
 */
const MSG = {
  usernameNotExist: "Username is not found. Invalid login credentials.",
  wrongRole: "Please make sure this is your identity.",
  loginSuccess: "You are successfully logged in.",
  wrongPassword: "Incorrect password.",
  loginError: "Oops! Something went wrong.",
};

/**
 * login a user.
 * @async
 * @function login
 * @param {Object} userRequest - The data of the user {username, password} where username can be an email.
 * @param {string} role - The role of the user {admin, user, superadmin}.
 * @return {Object} contains 3 attributes {error/success message : string, success : boolean, reason: string}.
 */
const login = async (userRequest, role, res) => {
  try {
    const loginRequest = await loginSchema.validateAsync(userRequest);
    let { username, password } = userRequest;
    // First Check if the username or email is in the database

    let user;
    if (isEmail(username)) {
      const email = username;
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({
        reason: "username",
        message: MSG.usernameNotExist,
        success: false,
      });
    }

    // We will check the role
    if (user.role !== role) {
      return res.status(403).json({
        reason: "role",
        message: MSG.wrongRole,
        success: false,
      });
    }
    // That means user is existing and trying to signin from the right portal
    // Now check for the password
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Sign in the token and issue it to the user
      let token = jwt.sign(
        {
          user_id: user._id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        SECRET,
        { expiresIn: "7 days" }
      );

      let result = {
        username: user.username,
        role: user.role,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: TOKEN_EXPIRATION,
      };

      return res.status(200).json({
        ...result,
        message: MSG.loginSuccess,
        success: true,
      });
    } else {
      return res.status(403).json({
        reason: "password",
        message: MSG.wrongPassword,
        success: false,
      });
    }
  } catch (err) {
    let errorMsg = MSG.loginError;
    if (err.isJoi === true) {
      err.status = 403;
      errorMsg = err.message;
    }
    return res.status(500).json({
      reason: "server",
      message: errorMsg,
      success: false,
    });
  }
};

function isEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = login;
