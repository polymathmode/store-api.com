import { NextFunction, Request, Response } from 'express';
import * as productService from '../../services/productService';
import * as productController from '../../controllers/productController';
import { ApiError } from '../../utils/apiError';

jest.mock('../../services/productService');

describe('Product Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockProduct = {
    _id: 'product123',
    name: 'Test Product',
    price: 99.99
  };

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: {},
      user: { _id: 'user123' }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    beforeEach(() => {
      mockRequest.body = {
        name: 'Test Product',
        price: 99.99
      };
    });

    it('should create product successfully', async () => {
      (productService.createProduct as jest.Mock).mockResolvedValue(mockProduct);

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockProduct,
        message: 'Product created successfully'
      });
    });

    it('should handle ApiError', async () => {
      const error = new ApiError('SKU already exists', 400);
      (productService.createProduct as jest.Mock).mockRejectedValue(error);

      await productController.createProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'SKU already exists'
      });
    });
  });

  describe('getAllProducts', () => {
    const mockPaginatedResponse = {
      products: [mockProduct],
      total: 1,
      page: 1,
      pages: 1
    };

    it('should return products successfully', async () => {
      (productService.getProducts as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      await productController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedResponse);
    });

    it('should handle ApiError', async () => {
      const error = new ApiError('Invalid category', 400);
      (productService.getProducts as jest.Mock).mockRejectedValue(error);

      await productController.getAllProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid category'
      });
    });
  });

  describe('getUserProducts', () => {
    beforeEach(() => {
      mockRequest.query = { userId: 'user123' };
    });

    it('should return user products successfully', async () => {
      const mockPaginatedResponse = {
        products: [mockProduct],
        total: 1,
        page: 1,
        pages: 1
      };
      (productService.getProducts as jest.Mock).mockResolvedValue(mockPaginatedResponse);

      await productController.getUserProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.json).toHaveBeenCalledWith(mockPaginatedResponse);
    });

    it('should handle missing userId', async () => {
      mockRequest.query = {};

      await productController.getUserProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockResponse as NextFunction

      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'userId query parameter is required'
      });
    });
  });

});