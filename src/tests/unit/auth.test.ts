import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { ApiError } from '../../utils/apiError';
import { createUser, authenticateUser } from '../../services/authService';

jest.mock('../../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user',
    comparePassword: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      
      (jwt.sign as jest.Mock).mockReturnValue('mockToken123');

      const userData = {
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      const result = await createUser(userData);

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith(userData);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser.id, role: mockUser.role },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(result).toEqual({
        token: 'mockToken123',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    });

    it('should throw an error if email is already registered', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      await expect(createUser(userData)).rejects.toThrow(ApiError);
      await expect(createUser(userData)).rejects.toThrow('Email already registered');
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully with valid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(true)
      });
      (jwt.sign as jest.Mock).mockReturnValue('mockToken123');

      const result = await authenticateUser('test@example.com', 'password123');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual({
        token: 'mockToken123',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          role: mockUser.role
        }
      });
    });

    it('should throw an error for invalid credentials', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        ...mockUser,
        comparePassword: jest.fn().mockResolvedValue(false)
      });

      await expect(authenticateUser('test@example.com', 'wrongpassword'))
        .rejects.toThrow(ApiError);
      await expect(authenticateUser('test@example.com', 'wrongpassword'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if user not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await expect(authenticateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow(ApiError);
      await expect(authenticateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow('Invalid credentials');
    });
  });
});