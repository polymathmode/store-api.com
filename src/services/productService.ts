import { Product } from '../models/product';
import { ApiError } from '../utils/apiError';
import mongoose from 'mongoose';


interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

interface QueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  // createdBy?: mongoose.Types.ObjectId;
  createdBy?:string;
}

interface PaginatedResponse {
  products: any[];
  total: number;
  page: number;
  pages: number;
}

export const createProduct = async (productData: ProductInput) => {
  try {
    return await Product.create(productData);
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError('SKU already exists', 400);
    }
    throw error;
  }
};

export const getProducts = async (options: QueryOptions): Promise<PaginatedResponse> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;
  
  const query: any = {};
  if (options.category) {
    query.category = options.category;
  }
  if (options.createdBy) query.createdBy = options.createdBy;

  const sortOption = options.sort ? { [options.sort]: -1 } : { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('createdBy', 'email') 
      .sort(sortOption as {[key:string]:1 | -1})
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    products,
    total,
    page,
    pages: Math.ceil(total / limit)
  };
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return product;
};

export const updateProduct = async (id: string, updates: Partial<ProductInput>) => {
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    return product;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError('SKU already exists', 400);
    }
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }
  return product;
};

export const searchProducts = async (query: string) => {
  if (!query) {
    throw new ApiError('Search query required', 400);
  }

  return Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });
};