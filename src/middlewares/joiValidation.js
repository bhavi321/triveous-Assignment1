const Joi = require("joi");

const userJoi = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string()
      .min(8)
      .required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      .message(
        "Password must include min 8 letters and at least: 1 special character,1 number. "
      ),
  });

  const loginJoi = Joi.object({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  });
  

  module.exports = {userJoi, loginJoi}