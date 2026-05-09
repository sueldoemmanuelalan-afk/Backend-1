import Product from '../../models/product.model.js';
import { fsGetAll, fsGetById, fsCreate, fsUpdate, fsDelete } from '../fs/product.fs.js';

const useFS = process.env.USE_FS === 'true' || process.env.USE_FS === '1';

// ============ CLASE PRINCIPAL ============

class ProductDAO {
  constructor() {
    console.log(`ProductDAO: usando ${useFS ? 'filesystem' : 'MongoDB'}`);
  }

  async getAll(query = {}, options = {}) {
    if (useFS) {
      return await this.fsGetAll(query, options);
    } else {
      return await this.mongoGetAll(query, options);
    }
  }

  async getById(id) {
    if (useFS) {
      return await this.fsGetById(id);
    } else {
      return await this.mongoGetById(id);
    }
  }

  async create(data) {
    if (useFS) {
      return await this.fsCreate(data);
    } else {
      return await this.mongoCreate(data);
    }
  }

  async update(id, data) {
    if (useFS) {
      return await this.fsUpdate(id, data);
    } else {
      return await this.mongoUpdate(id, data);
    }
  }

  async delete(id) {
    if (useFS) {
      return await this.fsDelete(id);
    } else {
      return await this.mongoDelete(id);
    }
  }

  // ============ MÉTODOS MONGODB ============

  async mongoGetAll(query, options) {
    return await Product.paginate(query, options);
  }

  async mongoGetById(id) {
    return await Product.findById(id);
  }

  async mongoCreate(data) {
    return await Product.create(data);
  }

  async mongoUpdate(id, data) {
    return await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async mongoDelete(id) {
    return await Product.findByIdAndDelete(id);
  }

  // ============ MÉTODOS FILESYSTEM ============

  fsGetAll = fsGetAll;
  fsGetById = fsGetById;
  fsCreate = fsCreate;
  fsUpdate = fsUpdate;
  fsDelete = fsDelete;
}

export default new ProductDAO();
