# Quickstart Guide: Collaborative Whiteboard

**Feature**: [spec.md](./spec.md)  
**For**: Developers implementing this feature

## Overview

This guide walks you through setting up and running the collaborative whiteboard web app locally. The app consists of a React frontend and Node.js backend with PostgreSQL database.

---

## Prerequisites

- **Node.js**: 20 LTS or higher
- **PostgreSQL**: 15 or higher
- **npm**: 10+ (comes with Node.js)
- **Git**: For version control

---

## Project Structure

```
collaborative-whiteboard/
├── frontend/              # React app (Vite)
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── stores/       # Zustand state stores
│   │   ├── services/     # WebSocket, API clients
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Canvas helpers, quadtree
│   ├── public/
│   └── package.json
│
├── backend/              # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── routes/       # REST API routes
│   │   ├── socket/       # WebSocket handlers
│   │   ├── models/       # Prisma models
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helpers
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── package.json
│
├── docker-compose.yml    # Local dev environment
└── README.md
```

---

## Setup Instructions

### 1. Clone and Install

```bash
# Create project directory
mkdir collaborative-whiteboard
cd collaborative-whiteboard

# Initialize frontend
mkdir frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install zustand socket.io-client
npm install -D @types/node
cd ..

# Initialize backend
mkdir backend
cd backend
npm init -y
npm install express socket.io cors prisma @prisma/client
npm install -D typescript @types/express @types/node @types/cors tsx nodemon
npx tsc --init
cd ..
```

### 2. Database Setup

```bash
cd backend

# Initialize Prisma
npx prisma init

# Edit prisma/schema.prisma (see data-model.md)
# Then generate Prisma client
npx prisma generate

# Create database
createdb whiteboard_dev

# Run migrations
npx prisma migrate dev --name init
```

### 3. Environment Configuration

Create `backend/.env`:
```env
DATABASE_URL="postgresql://localhost:5432/whiteboard_dev"
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev  # Uses nodemon + tsx
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev  # Vite dev server on port 5173
```

### 5. Verify Installation

Open browser to `http://localhost:5173`. You should see:
- Empty whiteboard canvas
- Toolbar with drawing tools
- Share button

---

## Quick Test

### Test 1: Draw on Canvas

1. Select pen tool from toolbar
2. Draw a line on canvas
3. Check browser console for WebSocket events
4. Check backend logs for incoming messages

### Test 2: Collaboration

1. Open `http://localhost:5173` in two browser windows
2. Draw in window 1
3. Verify drawing appears in window 2 within 2 seconds
4. Check backend logs for broadcast events

### Test 3: Persistence

1. Draw some elements
2. Note the whiteboard URL (contains UUID)
3. Refresh the page
4. Verify elements are still present

---

## Key Implementation Files

### Frontend

**`src/stores/whiteboardStore.ts`** - Zustand store
```typescript
import create from 'zustand';

interface WhiteboardStore {
  tool: 'pen' | 'line' | 'rectangle' | 'circle' | 'text' | 'eraser' | 'select';
  color: string;
  strokeWidth: number;
  elements: Element[];
  // ... actions
}

export const useWhiteboardStore = create<WhiteboardStore>((set) => ({
  tool: 'pen',
  color: '#000000',
  strokeWidth: 2,
  elements: [],
  // ... implementation
}));
```

**`src/components/Canvas.tsx`** - Main canvas component
```typescript
import { useRef, useEffect } from 'react';
import { useWhiteboardStore } from '../stores/whiteboardStore';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elements = useWhiteboardStore(state => state.elements);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    // Drawing logic...
  }, [elements]);
  
  return <canvas ref={canvasRef} width={1920} height={1080} />;
};
```

**`src/services/websocket.ts`** - Socket.io client
```typescript
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_WS_URL);

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

export const joinWhiteboard = (whiteboardId: string, user: User) => {
  socket.emit('join_whiteboard', { whiteboard_id: whiteboardId, user });
};

export const createElementEvent = (whiteboardId: string, element: Element) => {
  socket.emit('create_element', { whiteboard_id: whiteboardId, element });
};

export { socket };
```

### Backend

**`src/routes/whiteboards.ts`** - REST API routes
```typescript
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/whiteboards', async (req, res) => {
  const { title } = req.body;
  const whiteboard = await prisma.whiteboard.create({
    data: { title }
  });
  res.status(201).json(whiteboard);
});

router.get('/whiteboards/:id', async (req, res) => {
  const whiteboard = await prisma.whiteboard.findUnique({
    where: { id: req.params.id },
    include: { elements: true }
  });
  if (!whiteboard) return res.status(404).json({ error: 'Not found' });
  res.json(whiteboard);
});

export default router;
```

**`src/socket/handlers.ts`** - WebSocket handlers
```typescript
import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('join_whiteboard', async ({ whiteboard_id, user }) => {
      socket.join(whiteboard_id);
      
      // Broadcast to room
      socket.to(whiteboard_id).emit('user_joined', { user });
      
      // Send active users
      const sockets = await io.in(whiteboard_id).fetchSockets();
      socket.emit('join_success', {
        whiteboard_id,
        active_users: sockets.map(s => s.data.user)
      });
    });
    
    socket.on('create_element', async ({ whiteboard_id, element }) => {
      // Save to database
      const saved = await prisma.element.create({
        data: { ...element, whiteboard_id }
      });
      
      // Broadcast to all in room
      io.to(whiteboard_id).emit('element_created', { element: saved });
    });
  });
};
```

**`src/index.ts`** - Server entry point
```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import whiteboardRoutes from './routes/whiteboards';
import { setupSocketHandlers } from './socket/handlers';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN }
});

app.use(cors());
app.use(express.json());
app.use('/api/v1', whiteboardRoutes);

setupSocketHandlers(io);

httpServer.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## Common Issues

### Issue: "Cannot connect to WebSocket"
- **Cause**: Backend not running or CORS issue
- **Fix**: Check backend logs, verify `CORS_ORIGIN` in `.env`

### Issue: "Elements not persisting"
- **Cause**: Database connection issue
- **Fix**: Check `DATABASE_URL`, run `npx prisma migrate dev`

### Issue: "Drawing lag"
- **Cause**: Not throttling cursor events
- **Fix**: Add throttling (30 updates/second) to cursor move handler

---

## Next Steps

1. **Implement P1 User Story**: Basic drawing tools (pen, shapes, text)
2. **Add real-time sync**: WebSocket integration for collaboration
3. **Implement undo/redo**: Command pattern with action stack
4. **Add cursor tracking**: Show other users' cursors
5. **Optimize performance**: Quadtree spatial indexing for viewport culling

See [plan.md](./plan.md) for detailed implementation tasks.

---

## Resources

- **React Docs**: https://react.dev
- **Socket.io Docs**: https://socket.io/docs/v4/
- **Prisma Docs**: https://www.prisma.io/docs
- **Canvas API**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- **Pointer Events**: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events

---

## Support

For questions or issues:
1. Check [data-model.md](./data-model.md) for schema details
2. Check [contracts/](./contracts/) for API specifications
3. Review [research.md](./research.md) for architectural decisions
