import { NextFunction, Request, Response } from 'express';
import { createUserHandler, loginHandler } from '../../controllers/authController';
import { createUser, authenticateUser } from '../../services/authService';
import { ApiError } from '../../utils/apiError';

jest.mock('../../services/authService');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    role: 'user'
  };

  beforeEach(() => {
    mockRequest = {
      body: {
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createUserHandler', () => {
    it('should create a user successfully', async () => {
      const mockAuthResponse = {
        token: 'mockToken123',
        user: mockUser
      };

      (createUser as jest.Mock).mockResolvedValue(mockAuthResponse);

      await createUserHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token: mockAuthResponse.token,
        user: mockAuthResponse.user
      });
    });

    it('should handle ApiError', async () => {
      const error = new ApiError('Email already registered', 400);
      (createUser as jest.Mock).mockRejectedValue(error);

      await createUserHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Email already registered'
      });
    });

    it('should handle unexpected errors', async () => {
      const error = new Error('Unexpected error');
      (createUser as jest.Mock).mockRejectedValue(error);

      await createUserHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error registering user'
      });
    });
  });

  describe('loginHandler', () => {
    it('should login user successfully', async () => {
      const mockAuthResponse = {
        token: 'mockToken123',
        user: mockUser
      };

      (authenticateUser as jest.Mock).mockResolvedValue(mockAuthResponse);

      await loginHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: mockAuthResponse.token,
        user: mockAuthResponse.user
      });
    });

    it('should handle invalid credentials', async () => {
      const error = new ApiError('Invalid credentials', 401);
      (authenticateUser as jest.Mock).mockRejectedValue(error);

      await loginHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should handle unexpected errors', async () => {
      const error = new Error('Unexpected error');
      (authenticateUser as jest.Mock).mockRejectedValue(error);

      await loginHandler(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error during login'
      });
    });
  });
});