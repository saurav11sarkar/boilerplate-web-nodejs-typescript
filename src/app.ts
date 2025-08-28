import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFoundError from './app/error/notFoundError';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes/routes';
const app = express();

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Application routes (Centralized router)
app.use('/api/v1', router);

// Root router
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the server' });
});

// Not found route
app.use(notFoundError);

// Global error handler
app.use(globalErrorHandler);

export default app;
