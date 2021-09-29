require("dotenv").config();

module.exports = {
  DB: process.env.DB,
  SECRET: process.env.SECRET,
  TOKEN_EXPIRATION: process.env.TOKEN_EXPIRATION,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT,
};
