import mongoose from 'mongoose';
import { Product } from '../models/product';
import { ApiError } from '../utils/apiError';
import * as productService from '../services/productService';

jest.mock('../models/product');

describe('Product Service', () => {
  const mockProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'electronics',
    sku: 'TEST123',
    stock: 10,
    createdBy: new mongoose.Types.ObjectId(),
    updatedBy: new mongoose.Types.ObjectId()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      (Product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.createProduct(mockProduct);

      expect(Product.create).toHaveBeenCalledWith(mockProduct);
      expect(result).toEqual(mockProduct);
    });

    it('should throw ApiError when SKU already exists', async () => {
      const error = { code: 11000 };
      (Product.create as jest.Mock).mockRejectedValue(error);

      await expect(productService.createProduct(mockProduct))
        .rejects
        .toThrow(new ApiError('SKU already exists', 400));
    });
  });

  describe('getProducts', () => {
    const mockPaginatedResponse = {
      products: [mockProduct],
      total: 1,
      page: 1,
      pages: 1
    };

    beforeEach(() => {
      (Product.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockProduct])
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(1);
    });

    it('should return paginated products', async () => {
      const options = { page: 1, limit: 10 };
      const result = await productService.getProducts(options);

      expect(result).toEqual(mockPaginatedResponse);
      expect(Product.find).toHaveBeenCalled();
      expect(Product.countDocuments).toHaveBeenCalled();
    });

    it('should apply category filter when provided', async () => {
      const options = { category: 'electronics' };
      await productService.getProducts(options);

      expect(Product.find).toHaveBeenCalledWith({ category: 'electronics' });
    });

    it('should apply createdBy filter when provided', async () => {
      const options = { createdBy: mockProduct.createdBy.toString() };
      await productService.getProducts(options);

      expect(Product.find).toHaveBeenCalledWith({ createdBy: mockProduct.createdBy.toString() });
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.getProductById(mockProduct._id.toString());

      expect(result).toEqual(mockProduct);
      expect(Product.findById).toHaveBeenCalledWith(mockProduct._id.toString());
    });

    it('should throw ApiError when product not found', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProductById('nonexistent-id'))
        .rejects
        .toThrow(new ApiError('Product not found', 404));
    });
  });

  describe('updateProduct', () => {
    const updates = { price: 149.99 };

    it('should update product successfully', async () => {
      const updatedProduct = { ...mockProduct, ...updates };
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct(
        mockProduct._id.toString(),
        updates
      );

      expect(result).toEqual(updatedProduct);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        mockProduct._id.toString(),
        { $set: updates },
        { new: true, runValidators: true }
      );
    });

    it('should throw ApiError when product not found', async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(productService.updateProduct('nonexistent-id', updates))
        .rejects
        .toThrow(new ApiError('Product not found', 404));
    });

    it('should throw ApiError when SKU already exists', async () => {
      const error = { code: 11000 };
      (Product.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      await expect(productService.updateProduct(mockProduct._id.toString(), updates))
        .rejects
        .toThrow(new ApiError('SKU already exists', 400));
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct(mockProduct._id.toString());

      expect(result).toEqual(mockProduct);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(mockProduct._id.toString());
    });

    it('should throw ApiError when product not found', async () => {
      (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(productService.deleteProduct('nonexistent-id'))
        .rejects
        .toThrow(new ApiError('Product not found', 404));
    });
  });

  describe('searchProducts', () => {
    it('should search products successfully', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockProduct])
      });

      const result = await productService.searchProducts('test');

      expect(Product.find).toHaveBeenCalledWith(
        { $text: { $search: 'test' } },
        { score: { $meta: 'textScore' } }
      );
    });

    it('should throw ApiError when query is empty', async () => {
      await expect(productService.searchProducts(''))
        .rejects
        .toThrow(new ApiError('Search query required', 400));
    });
  });
});