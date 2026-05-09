import { Router } from 'express';
import {
  createCart,
  getCart,
  addProduct,
  deleteProduct,
  updateCart,
  updateQuantity,
  clearCart,
} from '../controllers/carts.controller.js';

const router = Router();

// crear carrito
router.post('/', createCart);

// obtener carrito con populate
router.get('/:cid', getCart);

// agregar producto
router.post('/:cid/products/:pid', addProduct);

// eliminar producto
router.delete('/:cid/products/:pid', deleteProduct);

// actualizar TODO el carrito
router.put('/:cid', updateCart);

// actualizar SOLO cantidad
router.put('/:cid/products/:pid', updateQuantity);

// vaciar carrito
router.delete('/:cid', clearCart);

export default router;
