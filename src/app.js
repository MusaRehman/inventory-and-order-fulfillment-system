import express from 'express';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
// import { createOrder } from './controllers/orders.js';
const app = express();

app.use(express.json());

// routes
app.use('/api/users', userRoutes);

// orders routes
app.use('/api/orders', orderRoutes);

export default app;