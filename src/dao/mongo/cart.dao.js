import Cart from '../../models/cart.model.js';
import Product from '../../models/product.model.js';

class CartDAO {
  async create() {
    console.log('[CartDAO.create] Creating new cart...');
    const newCart = await Cart.create({ products: [] });
    console.log('[CartDAO.create] Cart created with ID:', newCart._id.toString());

    // Verificar que se guardó
    const verify = await Cart.findById(newCart._id);
    if (verify) {
      console.log('[CartDAO.create] Cart verified in DB');
    } else {
      console.log('[CartDAO.create] WARNING: Cart not found immediately after creation!');
    }

    return newCart;
  }

  async getById(id) {
    console.log('[CartDAO.getById] Looking for cart:', id);
    const cart = await Cart.findById(id).populate('products.product');
    console.log('[CartDAO.getById] Result:', cart ? 'Found' : 'Not found');
    if (!cart) throw new Error('Carrito no encontrado');
    return cart;
  }

  async addProduct(cid, pid) {
    console.log('[CartDAO.addProduct] cid:', cid, ', pid:', pid);
    const product = await Product.findById(pid);
    if (!product) throw new Error('Producto no encontrado');

    console.log('[CartDAO.addProduct] Product found, looking for cart...');
    const cart = await Cart.findById(cid);
    console.log('[CartDAO.addProduct] Cart found:', cart ? 'Yes' : 'No');
    if (!cart) throw new Error('Carrito no encontrado');

    const existing = cart.products.find((p) => p.product.toString() === pid);

    if (existing) {
      existing.quantity++;
      console.log('[CartDAO.addProduct] Product already in cart, incrementing quantity');
    } else {
      cart.products.push({ product: pid, quantity: 1 });
      console.log('[CartDAO.addProduct] Adding new product to cart');
    }

    const saved = await cart.save();
    console.log('[CartDAO.addProduct] Cart saved');
    return saved;
  }

  async deleteProduct(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    return await cart.save();
  }

  async updateCart(cid, products) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');
    cart.products = products;
    return await cart.save();
  }

  async updateQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');
    const product = cart.products.find((p) => p.product.toString() === pid);
    if (!product) throw new Error('Producto no en carrito');
    product.quantity = quantity;
    return await cart.save();
  }

  async clear(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error('Carrito no encontrado');
    return await Cart.findByIdAndUpdate(cid, { products: [] });
  }
}

const cartDAOInstance = new CartDAO();
export default cartDAOInstance;
