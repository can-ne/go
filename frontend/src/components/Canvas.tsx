import { useEffect, useRef, useState } from 'react';
import { useWhiteboardStore } from '../stores/whiteboardStore';
import apiClient from '../services/api';
import { 
  drawElement, 
  clearCanvas, 
  screenToCanvas,
  generateElementId,
  generateUserId
} from '../utils/canvas';
import type { Element } from '../types/index';

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userId] = useState(() => generateUserId());
  
  const whiteboardId = useWhiteboardStore((state) => state.whiteboardId);
  const elements = useWhiteboardStore((state) => state.elements);
  const transform = useWhiteboardStore((state) => state.transform);
  const selectedTool = useWhiteboardStore((state) => state.selectedTool);
  const selectedColor = useWhiteboardStore((state) => state.selectedColor);
  const strokeWidth = useWhiteboardStore((state) => state.strokeWidth);
  const isDrawing = useWhiteboardStore((state) => state.isDrawing);
  const currentElement = useWhiteboardStore((state) => state.currentElement);
  
  const addElement = useWhiteboardStore((state) => state.addElement);
  const startDrawing = useWhiteboardStore((state) => state.startDrawing);
  const stopDrawing = useWhiteboardStore((state) => state.stopDrawing);
  const setCurrentElement = useWhiteboardStore((state) => state.setCurrentElement);
  const setOffset = useWhiteboardStore((state) => state.setOffset);
  const setZoom = useWhiteboardStore((state) => state.setZoom);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      redraw();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Redraw canvas when elements or transform change
  useEffect(() => {
    redraw();
  }, [elements, transform]);

  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    clearCanvas(ctx, canvas.width, canvas.height);
    
    // Draw all elements
    elements.forEach((element) => {
      drawElement(ctx, element, transform);
    });
    
    // Draw current element being drawn
    if (currentElement) {
      drawElement(ctx, currentElement, transform);
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (selectedTool === 'pan') return;
    if (!whiteboardId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const [x, y] = screenToCanvas(e.clientX, e.clientY, rect, transform);

    const elementId = generateElementId();
    const baseElement: Omit<Element, 'createdAt' | 'updatedAt'> = {
      id: elementId,
      whiteboardId,
      type: selectedTool === 'eraser' ? 'pen' : selectedTool,
      x,
      y,
      color: selectedColor,
      strokeWidth,
      zIndex: elements.length,
      creatorId: userId,
    };

    let element: Element;

    switch (selectedTool) {
      case 'pen':
        element = {
          ...baseElement,
          type: 'pen',
          points: [[x, y]],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;
      
      case 'line':
      case 'rectangle':
      case 'circle':
        element = {
          ...baseElement,
          type: selectedTool,
          width: 0,
          height: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        break;
      
      case 'text':
        const text = prompt('Enter text:');
        if (!text) return;
        element = {
          ...baseElement,
          type: 'text',
          content: text,
          fontSize: 16,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        // Save text immediately
        saveElement(element);
        addElement(element);
        return;
      
      default:
        return;
    }

    startDrawing(element);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || !currentElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const [x, y] = screenToCanvas(e.clientX, e.clientY, rect, transform);

    let updatedElement: Element = { ...currentElement };

    if (currentElement.type === 'pen') {
      updatedElement.points = [...(currentElement.points || []), [x, y]];
    } else {
      updatedElement.width = x - currentElement.x;
      updatedElement.height = y - currentElement.y;
    }

    setCurrentElement(updatedElement);
    redraw();
  }

  function handlePointerUp() {
    if (!isDrawing || !currentElement) return;

    // Save the element
    saveElement(currentElement);
    addElement(currentElement);
    stopDrawing();
  }

  async function saveElement(element: Element) {
    // In a real implementation, this would send to the backend API
    // For now, we'll just log it
    console.log('Saving element:', element);
    
    // TODO: Implement actual API call
    // await apiClient.createElement(element);
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    
    if (e.ctrlKey) {
      // Zoom
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(transform.zoom + delta);
    } else {
      // Pan
      setOffset(
        transform.offsetX - e.deltaX,
        transform.offsetY - e.deltaY
      );
    }
  }

  return (
    <div 
      ref={containerRef}
      style={{
        flex: 1,
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        style={{
          display: 'block',
          cursor: selectedTool === 'pan' ? 'grab' : 'crosshair',
          touchAction: 'none',
        }}
      />
    </div>
  );
}
