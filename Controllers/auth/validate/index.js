const User = require("../../../models/User");
const Joi = require("joi");

/**
 * Check if user account exist by username.
 * @async
 * @function validateUsername
 * @param {string} username - The username of the user.
 * @return {boolean} If the user has an account.
 */
const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * Check if user account exist by email.
 * @async
 * @function validateEmail
 * @param {string} email - The email of the user.
 * @return {boolean} If the user has an account.
 */
const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * Sets a validation schema for signup request body.
 * @const signupSchema
 */
const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),
});

/**
 * Sets a validation schema for login request body.
 * @const loginSchema
 */
const loginSchema = Joi.object({
  username: Joi.string().min(4).required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),
});

module.exports = {
  validateEmail,
  validateUsername,
  signupSchema,
  loginSchema,
};
