import { RequestHandler } from 'express';
import { ApiError } from '../utils/apiError';
import * as productService from '../services/productService';

export const createProduct: RequestHandler = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };
    const product = await productService.createProduct(productData);
    res.status(201).json({
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const result = await productService.getProducts({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      category: req.query.category as string,
      sort: req.query.sort as string,
      // createdBy: req.query.userId as string 
      // createdBy: req.query.createdBy as any 
    });

    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProduct: RequestHandler = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json(product);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};




export const getUserProducts: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
       res.status(400).json({ 
        message: 'userId query parameter is required' 
        
      });
      return
    }

    const result = await productService.getProducts({
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      category: req.query.category as string,
      sort: req.query.sort as string,
      createdBy: userId
    });

    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchProducts: RequestHandler = async (req, res) => {
  try {
    const products = await productService.searchProducts(req.query.q as string);
    res.json(products);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};


