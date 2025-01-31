import express from 'express'
import {
  createProduct,
  deleteProduct,
  getAllProducts, getProduct,
  getUserProducts,
  updateProduct,
  searchProducts
} from '../controllers/productController'
import { authorize, protect } from '../middleware/auth';

const router = express.Router();

router.post('/new-product', protect, authorize('admin'), createProduct);
router.put('/update-product/:id', protect, authorize('admin'), updateProduct);
router.get('/get-products', getAllProducts);
router.get('/get-product/:id', protect, getProduct);
router.get('/get-user-product', protect, authorize('admin', 'user'), getUserProducts);
router.delete('/products/:id', protect, authorize('admin'), deleteProduct);
router.get('/products/search', searchProducts);

export default router;