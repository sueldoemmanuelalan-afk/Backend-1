import ProductDAO from '../dao/mongo/product.dao.js';

const dao = ProductDAO;

export const getProducts = async (req, res) => {
  try {
    let { limit = 10, page = 1, query, sort } = req.query;

    // Construir filtro: puede ser por categoría o por disponibilidad
    const filter = {};
    if (query) {
      // Si el query es 'true' o 'false', filtra por status; si no, por categoría
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const result = await dao.getAll(filter, options);
    const baseUrl = '/api/products';

    const prevLink = result.hasPrevPage
      ? `${baseUrl}?limit=${limit}&page=${result.prevPage}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?limit=${limit}&page=${result.nextPage}${query ? `&query=${query}` : ''}${sort ? `&sort=${sort}` : ''}`
      : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await dao.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    // Validar campos requeridos
    if (!title || price === undefined || stock === undefined) {
      return res.status(400).json({
        error: 'Campos requeridos: title, price, stock',
      });
    }

    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ error: 'Price debe ser un número positivo' });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Stock debe ser un número positivo' });
    }

    const newProduct = await dao.create(req.body);

    const products = await dao.getAll({}, { limit: 100 });
    req.io.emit('updateProducts', products.docs);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await dao.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    // No permitir cambiar el ID
    if (req.body._id || req.body.id) {
      return res.status(400).json({ error: 'No se puede modificar el ID del producto' });
    }

    const updated = await dao.update(req.params.pid, req.body);

    const products = await dao.getAll({}, { limit: 100 });
    req.io.emit('updateProducts', products.docs);

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await dao.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    await dao.delete(req.params.pid);

    const products = await dao.getAll({}, { limit: 100 });
    req.io.emit('updateProducts', products.docs);

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
