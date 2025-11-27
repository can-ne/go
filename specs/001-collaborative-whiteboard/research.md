# Research: Collaborative Whiteboard Web App (React)

**Date**: November 27, 2025  
**Feature**: [spec.md](./spec.md)  
**Target Stack**: React

## Research Questions

### 1. Canvas Rendering Technology

**Decision**: HTML5 Canvas with React integration via refs

**Rationale**:
- HTML5 Canvas provides native 2D drawing API with excellent performance for thousands of elements
- Direct DOM manipulation via Canvas API is faster than SVG for high-frequency updates (real-time collaboration)
- Canvas supports both mouse and touch events natively (FR-017)
- Well-supported across Chrome, Firefox, Safari, Edge (FR-016)
- React refs provide clean integration without re-render overhead

**Alternatives considered**:
- **SVG**: Better for individual element manipulation but poor performance with 5000+ elements (SC-006). DOM overhead for each element causes slowdowns.
- **WebGL**: Overkill for 2D drawing, steeper learning curve, limited text rendering support
- **Third-party library (Fabric.js, Konva.js)**: Adds unnecessary abstraction and bundle size. Native Canvas API sufficient for requirements.

### 2. Real-Time Synchronization

**Decision**: WebSockets with operational transformation (OT) for conflict resolution

**Rationale**:
- WebSockets provide bidirectional, low-latency communication (<2s sync requirement, FR-007)
- Native WebSocket API supported in all modern browsers (FR-016)
- Operational transformation handles concurrent edits gracefully (addresses "simultaneous draw" edge case)
- Automatic reconnection logic can queue offline changes (FR-019)

**Alternatives considered**:
- **HTTP polling**: Higher latency (2-5s), inefficient for real-time collaboration, excessive server load
- **Server-Sent Events (SSE)**: Unidirectional, would require HTTP POST for client updates (complex)
- **WebRTC**: Peer-to-peer reduces server load but complex NAT traversal, requires signaling server anyway, harder to persist data

### 3. State Management

**Decision**: Zustand for global state + React Context for canvas state

**Rationale**:
- Zustand is lightweight (1KB), simple API, no boilerplate like Redux
- Perfect for managing: tool selection, color picker, undo/redo history (FR-004), user list (FR-014)
- React Context sufficient for canvas-specific state (viewport, zoom level)
- Both support React 18+ concurrent features

**Alternatives considered**:
- **Redux Toolkit**: More boilerplate than needed for this scope, 10KB+ bundle size
- **Context API only**: Performance issues with frequent canvas updates, causes unnecessary re-renders
- **Jotai/Recoil**: Atomic state is overkill for this feature's simple state tree

### 4. Undo/Redo Implementation

**Decision**: Command pattern with action stack (50 action limit, FR-004)

**Rationale**:
- Each drawing action is a command object: `{type, data, execute(), undo()}`
- Maintains two stacks: undo stack (past actions) and redo stack (undone actions)
- Works seamlessly with real-time sync: broadcast commands to other users
- Memory efficient: circular buffer with 50-item limit

**Alternatives considered**:
- **State snapshots**: Memory intensive for 5000 elements, slow to restore
- **Event sourcing**: Over-engineered for browser app, better suited for backend persistence

### 5. Backend Architecture

**Decision**: Node.js + Express + Socket.io + PostgreSQL

**Rationale**:
- Node.js shares JavaScript with frontend, simplifies full-stack development
- Socket.io provides WebSocket abstraction with fallbacks and reconnection logic
- Express lightweight for REST endpoints (create whiteboard, retrieve whiteboard)
- PostgreSQL with JSONB stores whiteboard elements efficiently, ACID guarantees for consistency
- All can run in single process for simple deployment

**Alternatives considered**:
- **Serverless (AWS Lambda + DynamoDB)**: Cold start issues hurt real-time experience, WebSocket support complex
- **Firebase**: Vendor lock-in, costs scale unpredictably, less control over sync logic
- **In-memory only (Redis)**: Data loss risk, requires separate persistence layer

### 6. Data Persistence Strategy

**Decision**: Server-side PostgreSQL as source of truth + localStorage for recent whiteboard list

**Rationale**:
- PostgreSQL stores all whiteboard data: elements, metadata, timestamps
- On connect: client loads full whiteboard state from server (or incremental if large)
- Real-time updates append to database via WebSocket handlers
- localStorage (5-10MB quota) stores recently accessed whiteboard URLs/titles (FR-021, FR-022)
- Clean separation: server = canonical data, localStorage = convenience cache

**Alternatives considered**:
- **localStorage only**: 5-10MB quota insufficient for multiple whiteboards with 5000 elements each, no collaboration
- **IndexedDB**: Overkill for simple whiteboard list, adds complexity
- **Cookie-based**: 4KB limit too small, sent on every HTTP request (wasteful)

### 7. Conflict Resolution for Concurrent Edits

**Decision**: Last-write-wins with timestamp + element-level locking for moves

**Rationale**:
- Creating elements: append-only, no conflicts (new UUIDs)
- Modifying elements: last timestamp wins, simpler than OT for property changes
- Moving elements: optimistic UI + server reconciliation if conflict detected
- Delete wins over modify (if simultaneous delete + edit)
- Matches "last write wins" edge case resolution from spec

**Alternatives considered**:
- **Full OT (Operational Transformation)**: Complex to implement correctly for all operations, overkill for whiteboard
- **CRDT (Conflict-free Replicated Data Types)**: Better for text editing, limited benefit for discrete drawing elements

### 8. Performance Optimization for 5000 Elements

**Decision**: Spatial indexing (quadtree) + viewport culling + canvas layering

**Rationale**:
- Quadtree indexes elements by position: only render elements in current viewport
- Reduces render from O(n) to O(log n) for pan/zoom operations
- Canvas layering: static layer (drawn elements) + active layer (current drawing) prevents full redraws
- Meets SC-006 (5000 elements) and FR-015 (load <3s)

**Alternatives considered**:
- **Render all elements**: Acceptable up to ~500 elements, then frame rate drops below 60fps
- **Virtual scrolling**: Works for lists, not applicable to 2D canvas with zoom
- **WebGL**: Over-engineered, increases complexity significantly

### 9. Touch and Mouse Input Handling

**Decision**: Unified pointer events API (PointerEvent)

**Rationale**:
- Modern PointerEvent API handles mouse, touch, and pen input uniformly
- Eliminates need for separate touch/mouse event handlers
- Supported in all target browsers (Chrome 55+, Firefox 59+, Safari 13+, Edge 12+)
- Automatic touch gesture detection (pan, pinch-zoom)

**Alternatives considered**:
- **Separate touch/mouse handlers**: Code duplication, harder to maintain, bug-prone
- **Third-party library (Hammer.js)**: Adds 20KB for functionality already in browsers

### 10. User Identification for Collaboration

**Decision**: Anonymous session IDs + optional name entry

**Rationale**:
- Generate UUID on first visit, store in localStorage
- Prompt user to enter name (or use "Anonymous User #123" default)
- No authentication required (FR-020: public link sharing)
- Simple, fast, meets "no signup" requirement (SC-001)

**Alternatives considered**:
- **Full authentication**: Violates "no signup" requirement, adds friction
- **Browser fingerprinting**: Privacy concerns, unreliable across sessions

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.2+ | UI framework |
| Frontend | TypeScript | 5.0+ | Type safety |
| Frontend | Zustand | 4.4+ | State management |
| Frontend | Vite | 5.0+ | Build tool, dev server |
| Backend | Node.js | 20 LTS | Runtime |
| Backend | Express | 4.18+ | HTTP server |
| Backend | Socket.io | 4.6+ | WebSocket layer |
| Database | PostgreSQL | 15+ | Data persistence |
| Database | Prisma | 5.6+ | ORM, migrations |

## Development Tools

- **Testing**: Vitest (frontend unit), Playwright (E2E), Jest (backend)
- **Linting**: ESLint + Prettier
- **Deployment**: Docker containers (frontend + backend + DB)
- **Version Control**: Git with feature branches

## Open Questions Resolved

All NEEDS CLARIFICATION items from spec resolved:
- ✅ Access control: Public links (Q1: A)
- ✅ Persistence: Browser localStorage + server DB (Q2: A + server)
- ✅ Real-time sync: WebSockets with Socket.io
- ✅ Canvas tech: HTML5 Canvas API
- ✅ State management: Zustand
- ✅ Backend: Node.js + PostgreSQL
