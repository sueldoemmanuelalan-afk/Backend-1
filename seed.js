import mongoose from 'mongoose';
import Product from './src/models/product.model.js';

await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');

await Product.insertMany([
  {
    title: 'Harry Potter 1',
    description: 'Libro',
    code: 'HP1',
    price: 100,
    stock: 10,
    category: 'fantasia',
  },
  {
    title: 'El Señor de los Anillos',
    description: 'Saga',
    code: 'LOTR1',
    price: 200,
    stock: 5,
    category: 'fantasia',
  },
  {
    title: 'Juego de Tronos',
    description: 'Saga',
    code: 'GOT1',
    price: 180,
    stock: 8,
    category: 'fantasia',
  },
]);

console.log('Productos cargados');
process.exit();
