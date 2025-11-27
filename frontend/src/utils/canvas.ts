import type { Element, CanvasTransform } from '../types/index.js';

export function drawElement(
  ctx: CanvasRenderingContext2D,
  element: Element,
  transform: CanvasTransform
) {
  ctx.save();
  
  // Apply transform
  ctx.translate(transform.offsetX, transform.offsetY);
  ctx.scale(transform.zoom, transform.zoom);
  
  // Set stroke styles
  ctx.strokeStyle = element.color;
  ctx.lineWidth = element.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  switch (element.type) {
    case 'pen':
      drawPen(ctx, element);
      break;
    case 'line':
      drawLine(ctx, element);
      break;
    case 'rectangle':
      drawRectangle(ctx, element);
      break;
    case 'circle':
      drawCircle(ctx, element);
      break;
    case 'text':
      drawText(ctx, element);
      break;
  }
  
  ctx.restore();
}

function drawPen(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.points || element.points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(element.points[0][0], element.points[0][1]);
  
  for (let i = 1; i < element.points.length; i++) {
    ctx.lineTo(element.points[i][0], element.points[i][1]);
  }
  
  ctx.stroke();
}

function drawLine(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.width || !element.height) return;
  
  ctx.beginPath();
  ctx.moveTo(element.x, element.y);
  ctx.lineTo(element.x + element.width, element.y + element.height);
  ctx.stroke();
}

function drawRectangle(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.width || !element.height) return;
  
  ctx.beginPath();
  ctx.rect(element.x, element.y, element.width, element.height);
  ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.width) return;
  
  const radius = element.width / 2;
  const centerX = element.x + radius;
  const centerY = element.y + radius;
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawText(ctx: CanvasRenderingContext2D, element: Element) {
  if (!element.content) return;
  
  const fontSize = element.fontSize || 16;
  ctx.font = `${fontSize}px sans-serif`;
  ctx.fillStyle = element.color;
  ctx.fillText(element.content, element.x, element.y);
}

export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
}

export function screenToCanvas(
  screenX: number,
  screenY: number,
  canvasRect: DOMRect,
  transform: CanvasTransform
): [number, number] {
  const x = (screenX - canvasRect.left - transform.offsetX) / transform.zoom;
  const y = (screenY - canvasRect.top - transform.offsetY) / transform.zoom;
  return [x, y];
}

export function canvasToScreen(
  canvasX: number,
  canvasY: number,
  transform: CanvasTransform
): [number, number] {
  const x = canvasX * transform.zoom + transform.offsetX;
  const y = canvasY * transform.zoom + transform.offsetY;
  return [x, y];
}

export function generateElementId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUserId(): string {
  const stored = localStorage.getItem('whiteboard_user_id');
  if (stored) return stored;
  
  const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('whiteboard_user_id', id);
  return id;
}
