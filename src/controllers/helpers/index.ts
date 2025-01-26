import jwt from 'jsonwebtoken';



export const generateToken = (user: any): string => 
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );





