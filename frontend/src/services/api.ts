import type { Whiteboard, Element, ApiResponse } from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/v1`;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Whiteboard endpoints
  async createWhiteboard(title?: string): Promise<Whiteboard> {
    const response = await this.request<Whiteboard>('/whiteboards', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return response.data;
  }

  async getWhiteboard(id: string): Promise<Whiteboard> {
    const response = await this.request<Whiteboard>(`/whiteboards/${id}`);
    return response.data;
  }

  async updateWhiteboard(
    id: string,
    data: { title?: string; thumbnail?: string }
  ): Promise<Whiteboard> {
    const response = await this.request<Whiteboard>(`/whiteboards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.data;
  }

  async deleteWhiteboard(id: string): Promise<void> {
    await this.request<void>(`/whiteboards/${id}`, {
      method: 'DELETE',
    });
  }

  async listWhiteboards(limit: number = 50, offset: number = 0): Promise<Whiteboard[]> {
    const response = await this.request<Whiteboard[]>(
      `/whiteboards?limit=${limit}&offset=${offset}`
    );
    return response.data;
  }
}

export default new ApiClient();
