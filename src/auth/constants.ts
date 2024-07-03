require('dotenv').config();

export const jwtConstants = {
  secret: process.env.JWT_KEY || 'SECRET_JWT_KEY_DEFAULT_EMPTY',
};
