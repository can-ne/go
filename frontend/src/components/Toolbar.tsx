import { useWhiteboardStore } from '../stores/whiteboardStore';
import type { ToolType } from '../types/index';

const COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFFF00', // Yellow
  '#FFA500', // Orange
  '#800080', // Purple
];

const STROKE_WIDTHS = [1, 2, 4, 6, 10, 15, 20];

export default function Toolbar() {
  const selectedTool = useWhiteboardStore((state) => state.selectedTool);
  const selectedColor = useWhiteboardStore((state) => state.selectedColor);
  const strokeWidth = useWhiteboardStore((state) => state.strokeWidth);
  const zoom = useWhiteboardStore((state) => state.transform.zoom);
  
  const setSelectedTool = useWhiteboardStore((state) => state.setSelectedTool);
  const setSelectedColor = useWhiteboardStore((state) => state.setSelectedColor);
  const setStrokeWidth = useWhiteboardStore((state) => state.setStrokeWidth);
  const setZoom = useWhiteboardStore((state) => state.setZoom);
  const resetTransform = useWhiteboardStore((state) => state.resetTransform);

  const tools: Array<{ type: ToolType; label: string; icon: string }> = [
    { type: 'pen', label: 'Pen', icon: '✏️' },
    { type: 'line', label: 'Line', icon: '📏' },
    { type: 'rectangle', label: 'Rectangle', icon: '▭' },
    { type: 'circle', label: 'Circle', icon: '○' },
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'eraser', label: 'Eraser', icon: '🧹' },
  ];

  function handleZoomIn() {
    setZoom(zoom + 0.1);
  }

  function handleZoomOut() {
    setZoom(zoom - 0.1);
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      gap: '1.5rem',
      flexWrap: 'wrap'
    }}>
      {/* Tools */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {tools.map((tool) => (
          <button
            key={tool.type}
            onClick={() => setSelectedTool(tool.type)}
            title={tool.label}
            style={{
              padding: '0.5rem 0.75rem',
              border: selectedTool === tool.type ? '2px solid #007bff' : '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: selectedTool === tool.type ? '#e7f3ff' : 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '32px', backgroundColor: '#ccc' }} />

      {/* Colors */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>Color:</span>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            title={color}
            style={{
              width: '28px',
              height: '28px',
              border: selectedColor === color ? '3px solid #007bff' : '1px solid #999',
              borderRadius: '4px',
              backgroundColor: color,
              cursor: 'pointer',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '32px', backgroundColor: '#ccc' }} />

      {/* Stroke Width */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: '#666' }}>Width:</span>
        <select
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          style={{
            padding: '0.25rem 0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {STROKE_WIDTHS.map((width) => (
            <option key={width} value={width}>
              {width}px
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '32px', backgroundColor: '#ccc' }} />

      {/* Zoom controls */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: zoom <= 0.1 ? 'not-allowed' : 'pointer',
            opacity: zoom <= 0.1 ? 0.5 : 1,
          }}
        >
          −
        </button>
        <span style={{ minWidth: '60px', textAlign: 'center', fontSize: '0.875rem' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: zoom >= 4 ? 'not-allowed' : 'pointer',
            opacity: zoom >= 4 ? 0.5 : 1,
          }}
        >
          +
        </button>
        <button
          onClick={resetTransform}
          style={{
            padding: '0.25rem 0.75rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
