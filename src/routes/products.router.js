import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';

const router = Router();

// GET con filtros
router.get('/', getProducts);

// GET by id
router.get('/:pid', getProductById);

// POST
router.post('/', createProduct);

// PUT
router.put('/:pid', updateProduct);

// DELETE
router.delete('/:pid', deleteProduct);

export default router;
