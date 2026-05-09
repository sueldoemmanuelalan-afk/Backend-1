import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';

import { connectDB } from './config/db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductDAO from './dao/mongo/product.dao.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dao = ProductDAO;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'src', 'public')));

// handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// pasar io a rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// SOCKETS
io.on('connection', async (socket) => {
  console.log('Cliente conectado');

  const products = await dao.getAll({}, { limit: 100 });
  socket.emit(
    'updateProducts',
    products.docs.map((doc) => doc.toObject())
  );
});

const PORT = 8080;

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
