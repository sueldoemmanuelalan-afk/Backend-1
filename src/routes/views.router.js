import { Router } from 'express';
import Product from '../models/product.model.js';
import Cart from '../models/cart.model.js';
import CartDAO from '../dao/mongo/cart.dao.js';

const router = Router();

const ensureCartId = async (req, res) => {
  let cartId = req.cookies?.cid;
  console.log('[ensureCartId] CartId from cookies:', cartId);

  if (!cartId) {
    try {
      console.log('[ensureCartId] No cartId found, creating new cart...');
      const cart = await CartDAO.create();
      cartId = cart._id.toString();
      console.log('[ensureCartId] New cart created with ID:', cartId);

      // Verificar que el carrito se guardó
      const cartVerify = await CartDAO.getById(cartId);
      console.log('[ensureCartId] Cart verified in DB:', cartVerify._id.toString());

      res.cookie('cid', cartId, { httpOnly: false });
      console.log('[ensureCartId] Cookie set with cartId:', cartId);
    } catch (err) {
      console.error('[ensureCartId] Error creating cart:', err.message);
      throw err;
    }
  } else {
    console.log('[ensureCartId] Using existing cartId:', cartId);
  }

  return cartId;
};

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/products', async (req, res) => {
  let { page = 1 } = req.query;

  const result = await Product.paginate({}, { limit: 10, page });
  const cartId = await ensureCartId(req, res);

  res.render('products', {
    products: result.docs.map((doc) => doc.toObject()),
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    cartId,
  });
});

router.get('/products/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid);
  if (!product) {
    return res.status(404).render('productDetail', { error: 'Producto no encontrado' });
  }

  const cartId = await ensureCartId(req, res);
  res.render('productDetail', {
    product: product.toObject(),
    cartId,
  });
});

router.get('/carts/:cid', async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product');
  if (!cart) {
    return res.status(404).render('cart', { cart: { products: [] } });
  }

  res.render('cart', {
    cart: {
      ...cart.toObject(),
      products: cart.products.map((item) => ({
        ...item.toObject(),
        product: item.product.toObject(),
      })),
    },
  });
});

export default router;
