import { Router, Request, Response, NextFunction } from 'express';
import type { Router as ExpressRouter } from 'express';
import whiteboardService from '../services/whiteboard.service.js';
import { ValidationError } from '../utils/errors.js';

const router: ExpressRouter = Router();

// POST /api/v1/whiteboards - Create new whiteboard
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    
    const whiteboard = await whiteboardService.create({ title });
    
    res.status(201).json({
      success: true,
      data: whiteboard,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/whiteboards/:id - Get whiteboard with elements
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const whiteboard = await whiteboardService.findById(id);
    
    res.status(200).json({
      success: true,
      data: whiteboard,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/whiteboards/:id - Update whiteboard metadata
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, thumbnail } = req.body;
    
    if (!title && !thumbnail) {
      throw new ValidationError('At least one field (title or thumbnail) must be provided');
    }
    
    const whiteboard = await whiteboardService.update(id, { title, thumbnail });
    
    res.status(200).json({
      success: true,
      data: whiteboard,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/whiteboards/:id - Delete whiteboard
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    await whiteboardService.delete(id);
    
    res.status(200).json({
      success: true,
      message: 'Whiteboard deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/whiteboards - List recent whiteboards
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const whiteboards = await whiteboardService.list(limit, offset);
    
    res.status(200).json({
      success: true,
      data: whiteboards,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
