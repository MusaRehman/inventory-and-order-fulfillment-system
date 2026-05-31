import express from 'express';
import userRoutes from './routes/users.js';
const app = express();

app.use(express.json());

// routes
app.use('/api/users', userRoutes);


export default app;