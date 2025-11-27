import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWhiteboardStore } from '../stores/whiteboardStore';
import apiClient from '../services/api';
import Canvas from '../components/Canvas';
import Toolbar from '../components/Toolbar';

export default function Whiteboard() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const setWhiteboardId = useWhiteboardStore((state) => state.setWhiteboardId);
  const setElements = useWhiteboardStore((state) => state.setElements);

  useEffect(() => {
    if (!id) return;

    loadWhiteboard();
  }, [id]);

  async function loadWhiteboard() {
    try {
      setLoading(true);
      const whiteboard = await apiClient.getWhiteboard(id!);
      setWhiteboardId(whiteboard.id);
      setElements(whiteboard.elements || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load whiteboard');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh' 
      }}>
        <p>Loading whiteboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <p style={{ color: '#d32f2f' }}>{error}</p>
        <button onClick={() => window.location.href = '/'}>Go Home</button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Toolbar />
      <Canvas />
    </div>
  );
}
