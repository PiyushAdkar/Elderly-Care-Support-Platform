import express from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/authRoutes.js';

// Import middlewares
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Default Route
app.get('/', (req, res) => {
  res.send('Elderly Care API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
