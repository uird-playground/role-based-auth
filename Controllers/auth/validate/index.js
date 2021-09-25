const User = require("../../../models/User");
const joi = require("joi");
const Joi = require("joi");

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

const signupSchema = Joi.object({
  name: Joi.string().min(2).required(),
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(8)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(4).required(),
  password: joi
    .string()
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
