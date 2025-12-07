import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import { seedDatabaseIfNeeded } from './utils/seeder';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());


app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'User Management API is running' });
});

app.use('/api/users', userRoutes);
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

const startServer = async () => {
  await seedDatabaseIfNeeded();

  app.listen(PORT, () => {
    console.log('Server is running');
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
