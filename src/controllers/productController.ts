// import { Request, Response,RequestHandler } from 'express';
// import { Product } from '../models/product';
// import { buildQuery } from './helpers';



// export const createProduct:RequestHandler = async (req: Request, res: Response,) => {
//   try {
//     const product = await Product.create(req.body);
//      res.status(201).json({
//       data:  product,
//       message: 'Product created successfully',

//     });
//      return;
//   } catch (error: any) {
//     if (error.code === 11000) {
//        res.status(400).json({ message: 'SKU already exists' });
//     }
//      res.status(400).json({ message: error.message });
//   }
// };


// export const getProducts:RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const { filter, options } = buildQuery(req.query);
    
//     const [products, total] = await Promise.all([
//       Product.find(filter)
//         .skip(options.skip)
//         .limit(options.limit)
//         .sort(options.sort as {[key:string]:1 | -1}),
//       Product.countDocuments(filter)
//     ]);

//      res.json({
//       products,
//       total,
//       page: Math.floor(options.skip / options.limit) + 1,
//       pages: Math.ceil(total / options.limit)
      
//     });
//     return
//   } catch (error: any) {
//      res.status(500).json({ message: error.message });
//   }
// };

// export const getProduct:RequestHandler = async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//        res.status(404).json({ message: 'Product not found' });
//        return
//     }
//      res.json(product);
//   } catch (error: any) {
//      res.status(500).json({ message: error.message });
//   }
// };

// export const updateProduct = async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndUpdate(
//       req.params.id,
//       { $set: req.body },
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     return res.json(product);
//   } catch (error: any) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'SKU already exists' });
//     }
//     return res.status(400).json({ message: error.message });
//   }
// };

// export const deleteProduct = async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     return res.json({ message: 'Product deleted successfully' });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const searchProducts = async (req: Request, res: Response) => {
//   try {
//     const { q } = req.query;
//     if (!q) {
//       return res.status(400).json({ message: 'Search query required' });
//     }

//     const products = await Product.find(
//       { $text: { $search: String(q) } },
//       { score: { $meta: 'textScore' } }
//     ).sort({ score: { $meta: 'textScore' } });

//     return res.json(products);
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// };

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


