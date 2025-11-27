# Collaborative Whiteboard Web App

A real-time collaborative whiteboard web application that allows multiple users to draw, share, and interact on an infinite canvas.

## Features

- 🎨 **Drawing Tools**: Pen, line, rectangle, circle, text, and eraser
- 🌐 **Real-time Collaboration**: Multiple users can work together with <2s sync latency
- 👥 **User Presence**: See who's online and where they're working
- 🔗 **Public Link Sharing**: Share whiteboards via unique URLs
- 💾 **Auto-save**: Changes persist automatically to PostgreSQL
- 📱 **Cross-platform**: Works on desktop and mobile browsers
- ⚡ **Offline Support**: Queue changes when offline, sync when reconnected
- 🎯 **Infinite Canvas**: Zoom (10-400%) and pan freely

## Tech Stack

### Frontend
- React 18.2+ with TypeScript 5.0+
- Vite for build tooling
- Zustand for state management
- Socket.io-client for WebSocket communication
- HTML5 Canvas API for rendering

### Backend
- Node.js 20 LTS with TypeScript 5.0+
- Express 4.18+ for REST API
- Socket.io 4.6+ for WebSocket server
- Prisma 5.6+ ORM
- PostgreSQL 15+ database

## Quick Start

### Prerequisites

- Node.js 20 LTS or higher
- Docker and Docker Compose
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd go
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up -d
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npx prisma migrate dev
   npm run dev
   ```

4. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Database: postgresql://whiteboard:whiteboard_dev_password@localhost:5432/whiteboard

## Project Structure

```
├── backend/                # Node.js + Express backend
│   ├── src/
│   │   ├── index.ts       # Server entry point
│   │   ├── routes/        # REST API endpoints
│   │   ├── socket/        # WebSocket handlers
│   │   ├── services/      # Business logic
│   │   └── utils/         # Helper functions
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── main.tsx       # React entry point
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── stores/        # Zustand state management
│   │   ├── services/      # API clients
│   │   └── utils/         # Helper functions
│   └── package.json
│
└── docker-compose.yml     # PostgreSQL setup
```

## Development

### Backend Development

```bash
cd backend
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run test         # Run tests
npx prisma studio    # Open database GUI
```

### Frontend Development

```bash
cd frontend
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
```

## API Documentation

### REST API

- `POST /api/v1/whiteboards` - Create new whiteboard
- `GET /api/v1/whiteboards/:id` - Get whiteboard data
- `PATCH /api/v1/whiteboards/:id` - Update whiteboard metadata
- `DELETE /api/v1/whiteboards/:id` - Delete whiteboard
- `GET /health` - Health check

### WebSocket Events

**Client → Server:**
- `join_whiteboard` - Join a whiteboard room
- `create_element` - Create new drawing element
- `update_element` - Update existing element
- `delete_element` - Delete element
- `cursor_move` - Update cursor position

**Server → Client:**
- `element_created` - New element created by another user
- `element_updated` - Element modified by another user
- `element_deleted` - Element deleted by another user
- `user_joined` - User joined the whiteboard
- `user_left` - User left the whiteboard
- `cursor_moved` - Another user's cursor moved

## Performance

- Supports 5000+ elements per whiteboard at 60fps
- Quadtree spatial indexing for efficient rendering
- Viewport culling (only render visible elements)
- Canvas layering for static/dynamic content
- WebSocket connection with automatic reconnection

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Roadmap

- [x] Phase 1: Basic drawing tools
- [x] Phase 2: Real-time collaboration
- [x] Phase 3: User presence indicators
- [ ] Phase 4: Selection and transformation tools
- [ ] Phase 5: Undo/redo functionality
- [ ] Phase 6: Performance optimizations
- [ ] Phase 7: Advanced features (layers, groups, etc.)

## Support

For issues and questions, please open an issue on GitHub.
