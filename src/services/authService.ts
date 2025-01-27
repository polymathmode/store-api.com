import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { ApiError } from '../utils/apiError';

interface UserInput {
  email: string;
  password: string;
  role?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  );
};

export const createUser = async (userData: UserInput): Promise<AuthResponse> => {
  const existingUser = await User.findOne({ email: userData.email });
  
  if (existingUser) {
    throw new ApiError('Email already registered', 400);
  }

  const user = await User.create(userData);
  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};

export const authenticateUser = async (email: string, password: string): Promise<AuthResponse> => {
  const user = await User.findOne({ email });
  
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError('Invalid credentials', 401);
  }

  const token = generateToken(user.id, user.role);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};