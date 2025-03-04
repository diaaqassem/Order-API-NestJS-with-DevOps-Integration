import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();
export const generateToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}
