// Element types
export type ElementType = 'pen' | 'line' | 'rectangle' | 'circle' | 'text';

// Tool types (includes eraser)
export type ToolType = ElementType | 'eraser' | 'select' | 'pan';

// Base element interface
export interface Element {
  id: string;
  whiteboardId: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Array<[number, number]>;
  color: string;
  strokeWidth: number;
  content?: string;
  fontSize?: number;
  zIndex: number;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

// Whiteboard interface
export interface Whiteboard {
  id: string;
  title?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  elements?: Element[];
}

// User interface
export interface User {
  id: string;
  name: string;
  color: string;
}

// Canvas transform state
export interface CanvasTransform {
  zoom: number; // 0.1 to 4.0 (10% to 400%)
  offsetX: number;
  offsetY: number;
}

// Drawing action for undo/redo
export interface DrawingAction {
  type: 'create' | 'update' | 'delete';
  element: Element;
  previousState?: Element;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  statusCode: number;
}

// WebSocket event types
export interface WSCreateElement {
  element: Element;
}

export interface WSUpdateElement {
  elementId: string;
  changes: Partial<Element>;
}

export interface WSDeleteElement {
  elementId: string;
}

export interface WSCursorMove {
  userId: string;
  x: number;
  y: number;
}

export interface WSUserJoined {
  user: User;
}

export interface WSUserLeft {
  userId: string;
}
