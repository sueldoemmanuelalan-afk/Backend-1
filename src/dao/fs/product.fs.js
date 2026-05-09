import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, 'products.json');

const ensureFile = async () => {
  try {
    await fs.promises.access(productsPath);
  } catch {
    await fs.promises.writeFile(productsPath, '[]', 'utf-8');
  }
};

const readFile = async () => {
  await ensureFile();
  const data = await fs.promises.readFile(productsPath, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeFile = async (products) => {
  await fs.promises.writeFile(productsPath, JSON.stringify(products, null, 2), 'utf-8');
};

const buildId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const fsGetAll = async (query = {}, options = {}) => {
  const items = await readFile();
  let filtered = items;

  if (query && Object.keys(query).length) {
    filtered = filtered.filter((item) =>
      Object.entries(query).every(([key, value]) => {
        if (value == null) return true;
        if (typeof item[key] === 'string') {
          return item[key].toLowerCase() === String(value).toLowerCase();
        }
        return item[key] === value;
      })
    );
  }

  if (options.sort && typeof options.sort === 'object') {
    const [[sortKey, sortOrder]] = Object.entries(options.sort);
    filtered = filtered.sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
      return 0;
    });
  }

  const limit = parseInt(options.limit, 10) || filtered.length || 10;
  const page = parseInt(options.page, 10) || 1;
  const totalDocs = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));
  const currentPage = Math.min(page, totalPages);
  const docs = filtered.slice((currentPage - 1) * limit, currentPage * limit);

  return {
    docs,
    totalDocs,
    totalPages,
    page: currentPage,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
  };
};

const fsGetById = async (id) => {
  const items = await readFile();
  return items.find((item) => item._id === id) || null;
};

const fsCreate = async (data) => {
  const items = await readFile();
  const product = {
    _id: buildId(),
    title: data.title || '',
    description: data.description || '',
    code: data.code || '',
    price: Number(data.price) || 0,
    status: data.status !== undefined ? Boolean(data.status) : true,
    stock: Number(data.stock) || 0,
    category: data.category || '',
    thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails : [],
    ...data,
  };
  items.push(product);
  await writeFile(items);
  return product;
};

const fsUpdate = async (id, data) => {
  const items = await readFile();
  const index = items.findIndex((item) => item._id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
    _id: id,
  };

  await writeFile(items);
  return items[index];
};

const fsDelete = async (id) => {
  const items = await readFile();
  const filtered = items.filter((item) => item._id !== id);
  if (filtered.length === items.length) return null;
  await writeFile(filtered);
  return { deleted: true };
};

export { fsGetAll, fsGetById, fsCreate, fsUpdate, fsDelete };
