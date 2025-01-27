// import { Request, Response, RequestHandler } from 'express';
// import { User } from '../models/user';
// import { generateToken } from './helpers';



// export const createUser:RequestHandler = async (req:Request, res:Response) => {
//   try {
//     const { email, password } = req.body;
    
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//        res.status(400).json({ message: 'Email already registered' });
//        return;
//     }

//     const user = await User.create({ email, password });
//     const token = generateToken(user);

//      res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//     console.log(error)
//      res.status(500).json({ message: 'Error registering user' });
//   }
// };




// export const login:RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user || !(await user.comparePassword(password))) {
//        res.status(401).json({ message: 'Invalid credentials' });
//        return
//     }

//     const token = generateToken(user);

//      res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         role: user.role
//       }
//     });
//   } catch (error) {
//      res.status(500).json({ message: 'Error during login' });
//   }
// };

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
