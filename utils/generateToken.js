import jwt from 'jsonwebtoken';

export const generateToken = (userId, name, email) => {
  return jwt.sign(
    { id: userId, name, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
