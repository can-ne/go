import prisma from '../utils/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import {
  validateUUID,
  validateElementData,
  ElementValidationData,
} from '../utils/validation.js';

export interface CreateElementDto extends ElementValidationData {
  whiteboardId: string;
  creatorId: string;
  zIndex?: number;
}

export interface UpdateElementDto {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  content?: string;
  fontSize?: number;
  zIndex?: number;
}

export class ElementService {
  async create(data: CreateElementDto) {
    validateUUID(data.whiteboardId, 'whiteboardId');
    validateUUID(data.creatorId, 'creatorId');
    validateElementData(data);

    // Ensure whiteboard exists
    const whiteboard = await prisma.whiteboard.findUnique({
      where: { id: data.whiteboardId },
    });

    if (!whiteboard) {
      throw new NotFoundError(`Whiteboard with id ${data.whiteboardId} not found`);
    }

    // Ensure creator (user) exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: data.creatorId },
    });

    if (!user) {
      // Auto-create user with default values
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
      user = await prisma.user.create({
        data: {
          id: data.creatorId,
          color: randomColor,
        },
      });
    }

    const element = await prisma.element.create({
      data: {
        whiteboardId: data.whiteboardId,
        creatorId: data.creatorId,
        type: data.type,
        x: data.x,
        y: data.y,
        width: data.width,
        height: data.height,
        points: data.points as any,
        color: data.color,
        strokeWidth: data.strokeWidth,
        content: data.content,
        fontSize: data.fontSize,
        zIndex: data.zIndex ?? 0,
      },
    });

    return element;
  }

  async findById(id: string) {
    validateUUID(id, 'elementId');

    const element = await prisma.element.findUnique({
      where: { id },
    });

    if (!element) {
      throw new NotFoundError(`Element with id ${id} not found`);
    }

    return element;
  }

  async findByWhiteboardId(whiteboardId: string) {
    validateUUID(whiteboardId, 'whiteboardId');

    const elements = await prisma.element.findMany({
      where: { whiteboardId },
      orderBy: {
        zIndex: 'asc',
      },
    });

    return elements;
  }

  async update(id: string, data: UpdateElementDto) {
    validateUUID(id, 'elementId');

    try {
      const element = await prisma.element.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });

      return element;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Element with id ${id} not found`);
      }
      throw error;
    }
  }

  async delete(id: string) {
    validateUUID(id, 'elementId');

    try {
      await prisma.element.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundError(`Element with id ${id} not found`);
      }
      throw error;
    }
  }

  async deleteMany(ids: string[]) {
    ids.forEach((id) => validateUUID(id, 'elementId'));

    await prisma.element.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}

export default new ElementService();
