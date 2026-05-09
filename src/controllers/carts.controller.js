import CartDAO from '../dao/mongo/cart.dao.js';

const dao = CartDAO;

// crear
export const createCart = async (req, res) => {
  try {
    const cart = await dao.create();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get con populate
export const getCart = async (req, res) => {
  try {
    const cart = await dao.getById(req.params.cid);
    res.json(cart);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// agregar producto
export const addProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    console.log(`[addProduct] Agregando producto ${pid} al carrito ${cid}`);

    // Intentar agregar el producto
    const updated = await dao.addProduct(cid, pid);
    console.log('[addProduct] Producto agregado exitosamente');
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    console.error('[addProduct] Error:', error.message);

    // Si el carrito no existe, crear uno nuevo
    if (error.message.includes('Carrito no encontrado')) {
      try {
        console.log('[addProduct] Creando nuevo carrito...');
        const newCart = await dao.create();
        const newCartId = newCart._id.toString();
        res.cookie('cid', newCartId);
        console.log('[addProduct] Nuevo carrito creado:', newCartId);

        // Agregar el producto al nuevo carrito
        const updated = await dao.addProduct(newCartId, req.params.pid);
        console.log('[addProduct] Producto agregado al carrito nuevo');
        return res.redirect(`/carts/${newCartId}`);
      } catch (innerError) {
        console.error('[addProduct] Error al crear carrito:', innerError.message);
        return res.status(500).send('Error al procesar tu solicitud. Por favor, intenta de nuevo.');
      }
    }

    // Para otros errores, redirigir a productos con mensaje genérico
    console.log('[addProduct] Redirigiendo a productos');
    res.redirect('/products');
  }
};

// eliminar producto
export const deleteProduct = async (req, res) => {
  try {
    const updated = await dao.deleteProduct(req.params.cid, req.params.pid);
    res.json({ message: 'Producto eliminado del carrito', cart: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// actualizar TODO el carrito
export const updateCart = async (req, res) => {
  try {
    if (!req.body.products || !Array.isArray(req.body.products)) {
      return res.status(400).json({ error: 'products debe ser un array' });
    }
    const updated = await dao.updateCart(req.params.cid, req.body.products);
    res.json({ message: 'Carrito actualizado', cart: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// actualizar SOLO cantidad
export const updateQuantity = async (req, res) => {
  try {
    if (req.body.quantity === undefined || typeof req.body.quantity !== 'number') {
      return res.status(400).json({ error: 'quantity debe ser un número' });
    }
    if (req.body.quantity < 1) {
      return res.status(400).json({ error: 'quantity debe ser mayor a 0' });
    }
    const updated = await dao.updateQuantity(req.params.cid, req.params.pid, req.body.quantity);
    res.json({ message: 'Cantidad actualizada', cart: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const updated = await dao.clear(req.params.cid);
    res.json({ message: 'Carrito vaciado', cart: updated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
