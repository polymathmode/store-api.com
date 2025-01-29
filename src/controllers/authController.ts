
import { Request, Response, RequestHandler } from 'express';
import { createUser, authenticateUser } from '../services/authService';
import { ApiError } from '../utils/apiError';

export const createUserHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const response = await createUser({ email, password, role });

    res.status(201).json({
      message: 'User registered successfully',
      token: response.token,
      user: response.user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
  }
};

export const loginHandler: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await authenticateUser(email, password);

    res.json({
      message: 'Login successful',
      token: response.token,
      user: response.user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error during login' });
    }
  }
};
