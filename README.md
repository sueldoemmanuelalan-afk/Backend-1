# 📚 Saga Store

Backend e-commerce desarrollado con **Node.js, Express y MongoDB**, orientado a la gestión de productos y carritos de compra para una tienda de libros y sagas de fantasía.

El proyecto integra conceptos fundamentales del desarrollo backend moderno:
- API RESTful
- Persistencia con MongoDB y Mongoose
- Arquitectura modular
- CRUD completo
- WebSockets en tiempo real
- Vistas dinámicas con Handlebars
- Manejo de asincronía con async/await

---

# 🚀 Tecnologías Utilizadas

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Frontend de vistas
- Handlebars
- HTML5
- CSS3
- JavaScript

## Herramientas
- Postman
- Visual Studio Code
- Git & GitHub
- Socket.io

---

# 📂 Estructura del Proyecto

```bash
src/
│
├── config/
├── controllers/
├── dao/
├── models/
├── public/
├── routes/
├── views/
│
├── app.js
```

⚙️ Instalación
1. Clonar repositorio
```
git clone https://github.com/sueldoemmanuelalan-afk/Backend-1.git
```
2. Entrar a la carpeta
```
cd Backend-1
```
3. Instalar dependencias
```
npm install
```
4. Configurar variables de entorno
Crear archivo .env
```
PORT=8080
MONGO_URI=tu_conexion_mongodb
```
5. Ejecutar proyecto
```
npm run dev
```
o
```
npm start
```
🌐 Servidor

El servidor se ejecuta en:
```
http://localhost:8080
```
📦 Endpoints — Productos
Obtener productos
```
GET /api/products
```
Obtener producto por ID
```
GET /api/products/:pid
```
Crear producto
```
POST /api/products
```
Actualizar producto
```
PUT /api/products/:pid
```
Eliminar producto
```
DELETE /api/products/:pid
```
🛒 Endpoints — Carritos
Crear carrito
```
POST /api/carts
```
Obtener carrito
```
GET /api/carts/:cid
```
Agregar producto al carrito
```
POST /api/carts/:cid/products/:pid
```
Eliminar producto del carrito
```
DELETE /api/carts/:cid/products/:pid
```
Vaciar carrito
```
DELETE /api/carts/:cid
```
🖥️ Vistas Implementadas
| Ruta           | Descripción          |
| -------------- | -------------------- |
| /              | Página principal     |
| /products      | Listado de productos |
| /products/:pid | Detalle de producto  |
| /carts/:cid    | Vista del carrito    |

⚡ Funcionalidades Principales

✅ CRUD completo de productos

✅ Gestión avanzada de carritos

✅ Persistencia con MongoDB

✅ Relaciones entre documentos con populate()

✅ Arquitectura modular

✅ Middleware Express

✅ Paginación y filtros

✅ WebSockets en tiempo real

✅ Vistas dinámicas con Handlebars

✅ Persistencia de carrito mediante cookies


🗄️ Base de Datos

MongoDB

Colecciones utilizadas:

products
carts
Mongoose

Se implementaron:

schemas
models
referencias ObjectId
populate()


🔄 Tiempo Real

El proyecto utiliza Socket.io para actualizar productos en tiempo real sin necesidad de recargar la página.

🧪 Testing

Las pruebas de endpoints fueron realizadas utilizando:

Postman

📸 Evidencias del Proyecto

Home

Página principal de bienvenida a Saga Store.

Productos

Listado dinámico de productos con paginación.

Detalle

Vista individual de cada producto.

Carrito

Sistema de gestión y actualización de productos agregados.


🧠 Conceptos Aplicados

Express Router

Middleware

Async/Await

MongoDB

Mongoose

Arquitectura MVC

CRUD

REST API

WebSockets

Renderizado dinámico


🚀 Mejoras Futuras

Autenticación JWT

Roles de usuario

Panel administrador

Pasarela de pagos

Deploy en la nube

Testing automatizado

Subida de imágenes


👨‍💻 Autor

Desarrollado por Alan Sueldo.
