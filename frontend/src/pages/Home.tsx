import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import type { Whiteboard } from '../types/index';

export default function Home() {
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadWhiteboards();
  }, []);

  async function loadWhiteboards() {
    try {
      setLoading(true);
      const data = await apiClient.listWhiteboards();
      setWhiteboards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load whiteboards');
    } finally {
      setLoading(false);
    }
  }

  async function createNewWhiteboard() {
    try {
      const whiteboard = await apiClient.createWhiteboard('Untitled Whiteboard');
      navigate(`/whiteboard/${whiteboard.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create whiteboard');
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Collaborative Whiteboard</h1>
        <p style={{ color: '#666' }}>Create and share whiteboards with real-time collaboration</p>
      </header>

      <button
        onClick={createNewWhiteboard}
        style={{
          padding: '1rem 2rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        + Create New Whiteboard
      </button>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {whiteboards.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {whiteboards.map((wb) => (
            <div
              key={wb.id}
              onClick={() => navigate(`/whiteboard/${wb.id}`)}
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#007bff';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <h3 style={{ margin: '0 0 0.5rem 0' }}>{wb.title || 'Untitled'}</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
                Last modified: {new Date(wb.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          No whiteboards yet. Create one to get started!
        </p>
      )}
    </div>
  );
}
