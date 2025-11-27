import prisma from '../utils/prisma.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { validateUUID, validateStringLength } from '../utils/validation.js';

export interface CreateWhiteboardDto {
  title?: string;
}

export interface UpdateWhiteboardDto {
  title?: string;
  thumbnail?: string;
}

export class WhiteboardService {
  async create(data: CreateWhiteboardDto) {
    if (data.title) {
      validateStringLength(data.title, 100, 'title');
    }

    const whiteboard = await prisma.whiteboard.create({
      data: {
        title: data.title,
      },
    });

    return whiteboard;
  }

  async findById(id: string) {
    validateUUID(id, 'whiteboardId');

    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id },
      include: {
        elements: {
          orderBy: {
            zIndex: 'asc',
          },
        },
      },
    });

    if (!whiteboard) {
      throw new NotFoundError(`Whiteboard with id ${id} not found`);
    }

    return whiteboard;
  }

  async update(id: string, data: UpdateWhiteboardDto) {
    validateUUID(id, 'whiteboardId');

    if (data.title) {
      validateStringLength(data.title, 100, 'title');
    }

    try {
      const whiteboard = await prisma.whiteboard.update({
        where: { id },
        data: {
          title: data.title,
          thumbnail: data.thumbnail,
          updatedAt: new Date(),
        },
      });

      return whiteboard;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Whiteboard with id ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string) {
    validateUUID(id, 'whiteboardId');

    try {
      await prisma.whiteboard.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Whiteboard with id ${id} not found`);
      }
      throw error;
    }
  }

  async list(limit: number = 50, offset: number = 0) {
    const whiteboards = await prisma.whiteboard.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return whiteboards;
  }
}

export default new WhiteboardService();
