import { ValidationError } from './errors.js';

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Hex color regex pattern
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

// Valid element types
const VALID_ELEMENT_TYPES = ['pen', 'line', 'rectangle', 'circle', 'text'] as const;
export type ElementType = typeof VALID_ELEMENT_TYPES[number];

// Valid action types
const VALID_ACTION_TYPES = ['create', 'move', 'resize', 'delete', 'modify'] as const;
export type ActionType = typeof VALID_ACTION_TYPES[number];

export function isValidUUID(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function validateUUID(value: string, fieldName: string): void {
  if (!isValidUUID(value)) {
    throw new ValidationError(`${fieldName} must be a valid UUID`);
  }
}

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value);
}

export function validateHexColor(value: string, fieldName: string): void {
  if (!isValidHexColor(value)) {
    throw new ValidationError(`${fieldName} must be a valid hex color (e.g., #FF0000)`);
  }
}

export function validateElementType(value: string): asserts value is ElementType {
  if (!VALID_ELEMENT_TYPES.includes(value as ElementType)) {
    throw new ValidationError(
      `Element type must be one of: ${VALID_ELEMENT_TYPES.join(', ')}`
    );
  }
}

export function validateActionType(value: string): asserts value is ActionType {
  if (!VALID_ACTION_TYPES.includes(value as ActionType)) {
    throw new ValidationError(
      `Action type must be one of: ${VALID_ACTION_TYPES.join(', ')}`
    );
  }
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): void {
  if (value < min || value > max) {
    throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
  }
}

export function validateStringLength(
  value: string,
  maxLength: number,
  fieldName: string
): void {
  if (value.length > maxLength) {
    throw new ValidationError(`${fieldName} must not exceed ${maxLength} characters`);
  }
}

export function validateRequired(value: any, fieldName: string): void {
  if (value === null || value === undefined || value === '') {
    throw new ValidationError(`${fieldName} is required`);
  }
}

// Validate element data
export interface ElementValidationData {
  type: string;
  x: number;
  y: number;
  color: string;
  strokeWidth: number;
  width?: number;
  height?: number;
  points?: Array<[number, number]>;
  content?: string;
  fontSize?: number;
}

export function validateElementData(data: ElementValidationData): void {
  validateRequired(data.type, 'type');
  validateElementType(data.type);
  
  validateRequired(data.x, 'x');
  validateRequired(data.y, 'y');
  
  validateRequired(data.color, 'color');
  validateHexColor(data.color, 'color');
  
  validateRequired(data.strokeWidth, 'strokeWidth');
  validateRange(data.strokeWidth, 1, 20, 'strokeWidth');
  
  // Type-specific validation
  if (data.type === 'pen') {
    validateRequired(data.points, 'points');
    if (!Array.isArray(data.points) || data.points.length < 2) {
      throw new ValidationError('Pen elements must have at least 2 points');
    }
  }
  
  if (data.type === 'text') {
    validateRequired(data.content, 'content');
    if (data.content) {
      validateStringLength(data.content, 1000, 'content');
    }
    if (data.fontSize !== undefined) {
      validateRange(data.fontSize, 12, 72, 'fontSize');
    }
  }
}
