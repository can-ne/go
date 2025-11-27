import { create } from 'zustand';
import type { Element, CanvasTransform, ToolType } from '../types/index.js';

interface WhiteboardState {
  // Whiteboard data
  whiteboardId: string | null;
  elements: Element[];
  
  // Canvas state
  transform: CanvasTransform;
  selectedTool: ToolType;
  selectedColor: string;
  strokeWidth: number;
  
  // Drawing state
  isDrawing: boolean;
  currentElement: Element | null;
  
  // Actions
  setWhiteboardId: (id: string) => void;
  setElements: (elements: Element[]) => void;
  addElement: (element: Element) => void;
  updateElement: (id: string, changes: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  
  // Tool actions
  setSelectedTool: (tool: ToolType) => void;
  setSelectedColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  
  // Canvas actions
  setZoom: (zoom: number) => void;
  setOffset: (x: number, y: number) => void;
  resetTransform: () => void;
  
  // Drawing actions
  startDrawing: (element: Element) => void;
  stopDrawing: () => void;
  setCurrentElement: (element: Element | null) => void;
}

const DEFAULT_TRANSFORM: CanvasTransform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
};

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  // Initial state
  whiteboardId: null,
  elements: [],
  transform: DEFAULT_TRANSFORM,
  selectedTool: 'pen',
  selectedColor: '#000000',
  strokeWidth: 2,
  isDrawing: false,
  currentElement: null,
  
  // Whiteboard actions
  setWhiteboardId: (id) => set({ whiteboardId: id }),
  
  setElements: (elements) => set({ elements }),
  
  addElement: (element) =>
    set((state) => ({
      elements: [...state.elements, element],
    })),
  
  updateElement: (id, changes) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...changes } : el
      ),
    })),
  
  deleteElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
    })),
  
  // Tool actions
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  
  // Canvas actions
  setZoom: (zoom) =>
    set((state) => ({
      transform: { ...state.transform, zoom: Math.max(0.1, Math.min(4, zoom)) },
    })),
  
  setOffset: (offsetX, offsetY) =>
    set((state) => ({
      transform: { ...state.transform, offsetX, offsetY },
    })),
  
  resetTransform: () => set({ transform: DEFAULT_TRANSFORM }),
  
  // Drawing actions
  startDrawing: (element) =>
    set({
      isDrawing: true,
      currentElement: element,
    }),
  
  stopDrawing: () =>
    set({
      isDrawing: false,
      currentElement: null,
    }),
  
  setCurrentElement: (element) => set({ currentElement: element }),
}));
