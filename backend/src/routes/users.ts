import { Router, Request, Response } from 'express';
import prisma from '../db';
import { searchQuerySchema, userIdSchema } from '../validators/user';

const router = Router();

enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { q } = searchQuerySchema.parse(req.query);

    let users;
    if (q) {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
        orderBy: { createdAt: Order.DESC },
      });
    } else {
      users = await prisma.user.findMany({
        orderBy: { createdAt: Order.DESC },
      });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = searchQuerySchema.parse(req.query);

    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: Order.DESC },
    });

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error instanceof Error && error.message.includes('ID must be a number')) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
