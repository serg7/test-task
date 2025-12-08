import request from 'supertest';
import express, { Express } from 'express';
import cors from 'cors';
import userRoutes from '../routes/users';
import prisma from '../db';

const createTestApp = (): Express => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/users', userRoutes);
  return app;
};

jest.mock('../db', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('User API Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users when no query parameter is provided', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          address: '123 Main St',
          city: 'New York',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          company: 'Tech Inc',
          address: '456 Oak Ave',
          city: 'San Francisco',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter users by name when query parameter is provided', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          address: '123 Main St',
          city: 'New York',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users?q=John');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'John', mode: 'insensitive' } },
            { email: { contains: 'John', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should filter users by email when query parameter is provided', async () => {
      const mockUsers = [
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          company: 'Tech Inc',
          address: '456 Oak Ave',
          city: 'San Francisco',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users?q=jane@example');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'jane@example', mode: 'insensitive' } },
            { email: { contains: 'jane@example', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no users match the query', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/users?q=nonexistent');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch users' });
    });
  });

  describe('GET /api/users/search', () => {
    it('should search users by name', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          company: 'Acme Corp',
          address: '123 Main St',
          city: 'New York',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/users/search?q=John');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'John', mode: 'insensitive' } },
            { email: { contains: 'John', mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return 400 when query parameter is missing', async () => {
      const response = await request(app).get('/api/users/search');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Search query parameter "q" is required' });
    });

    it('should return 400 when query parameter is empty', async () => {
      const response = await request(app).get('/api/users/search?q=');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Search query parameter "q" is required' });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/users/search?q=test');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to search users' });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        address: '123 Main St',
        city: 'New York',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'User deleted successfully',
        user: mockUser,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return 404 when user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'User not found' });
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid user ID format', async () => {
      const response = await request(app).delete('/api/users/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid user ID format' });
    });

    it('should handle database errors gracefully', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete user' });
    });
  });
});
