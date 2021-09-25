// Modules
const bcrypt = require("bcryptjs");

// Imports
const {
  validateEmail,
  validateUsername,
  signupSchema,
} = require("../validate");
const User = require("../../../models/User");

const MSG = {
  usernameExists: "Username is already taken.",
  emailExists: "Email is already registered.",
  signupSuccess: "You are successfully signed up.",
  signupError: "Unable to create your account.",
};

const register = async (userRequest, role, res) => {
  try {
    const signupRequest = await signupSchema.validateAsync(userRequest);
    // Validate the username
    let usernameNotTaken = await validateUsername(signupRequest.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: MSG.usernameExists,
        success: false,
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(signupRequest.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: MSG.emailExists,
        success: false,
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(signupRequest.password, 12);
    // create a new user
    const newUser = new User({
      ...signupRequest,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: MSG.signupSuccess,
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    let errorMsg = MSG.signupError;
    if (err.isJoi === true) {
      err.status = 403;
      errorMsg = err.message;
    }
    return res.status(500).json({
      message: errorMsg,
      success: false,
    });
  }
};

module.exports = register;
