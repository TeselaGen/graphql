import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// // define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'release', 'production'])
    .default('development'),
  PORT: Joi.number()
    .default(3001)
}).unknown()
  .required();

//const envVars = process.env;
const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
// if (error) {
//   throw new Error(`Config validation error: ${error.message}`);
// }

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  // mongooseDebug: envVars.MONGOOSE_DEBUG,
  // jwtSecret: envVars.JWT_SECRET,
  // mongo: {
  //   host: envVars.MONGO_HOST,
  //   port: envVars.MONGO_PORT
  // }
};

export default config;