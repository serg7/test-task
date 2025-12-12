import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../db';
import { searchQuerySchema, userIdSchema } from '../validators/user';
import { ZodError } from 'zod';

const router = Router();

enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        message: 'Search query must be a valid string',
        details: error.errors,
      });
    }
    next(error);
  }
});

router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = searchQuerySchema.parse(req.query);

    if (!q) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'Search query parameter "q" is required'
      });
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
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        message: 'Search query must be a valid string',
        details: error.errors,
      });
    }
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = userIdSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `No user found with ID ${id}`,
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: 'User deleted successfully',
      user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: 'Invalid user ID',
        message: 'User ID must be a valid number',
        details: error.errors,
      });
    }
    next(error);
  }
});

export default router;
