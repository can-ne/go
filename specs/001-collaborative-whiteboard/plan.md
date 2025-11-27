# Implementation Plan: Collaborative Whiteboard Web App

**Branch**: `001-collaborative-whiteboard` | **Date**: November 27, 2025 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-collaborative-whiteboard/spec.md`

## Summary

A real-time collaborative whiteboard web application that allows multiple users to draw, share, and interact on an infinite canvas without authentication. Uses React 18+ for the frontend with HTML5 Canvas API for rendering, Node.js + Express + Socket.io for the backend with WebSocket-based real-time synchronization, and PostgreSQL for persistent storage. Browser localStorage manages recently accessed whiteboard lists.

## Technical Context

**Language/Version**: 
- Frontend: TypeScript 5.0+, React 18.2+
- Backend: TypeScript 5.0+, Node.js 20 LTS

**Primary Dependencies**:
- Frontend: React, Zustand (state), Socket.io-client, Vite (build)
- Backend: Express, Socket.io, Prisma (ORM), PostgreSQL driver

**Storage**: PostgreSQL 15+ with JSONB for element arrays, browser localStorage for recent whiteboard list

**Testing**: 
- Frontend: Vitest (unit), Playwright (E2E)
- Backend: Jest (unit), Supertest (API integration)

**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- <2 second sync latency for real-time collaboration (FR-007, SC-002)
- 60fps canvas rendering with up to 5000 elements (SC-006)
- <3 second load time for 1000 element whiteboard (FR-015)
- Support 10+ concurrent users per whiteboard (SC-003)

**Constraints**:
- No authentication required (public link sharing, FR-020)
- Must work offline with reconnection (FR-018, FR-019)
- localStorage quota: 5-10MB for whiteboard list (FR-021, FR-022)
- WebSocket connection required for collaboration

**Scale/Scope**:
- ~5000 canvas elements per whiteboard max
- 50 recently accessed whiteboards in localStorage
- 100 elements/minute rate limit per user
- 50 action undo/redo history (FR-004)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS (Constitution is template-only, no specific constraints defined)

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── index.ts              # Server entry point
│   ├── routes/
│   │   └── whiteboards.ts    # REST API endpoints
│   ├── socket/
│   │   └── handlers.ts       # WebSocket event handlers
│   ├── services/
│   │   ├── whiteboard.service.ts
│   │   └── element.service.ts
│   ├── models/               # Prisma generated
│   └── utils/
│       ├── validation.ts
│       └── errors.ts
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Generated migrations
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── package.json
└── tsconfig.json

frontend/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component
│   ├── pages/
│   │   ├── Home.tsx          # Whiteboard list
│   │   └── Whiteboard.tsx    # Canvas page
│   ├── components/
│   │   ├── Canvas.tsx        # Main canvas component
│   │   ├── Toolbar.tsx       # Drawing tools
│   │   ├── ColorPicker.tsx
│   │   ├── UserCursors.tsx   # Other users' cursors
│   │   └── ShareDialog.tsx
│   ├── stores/
│   │   ├── whiteboardStore.ts  # Zustand state
│   │   └── userStore.ts
│   ├── services/
│   │   ├── websocket.ts      # Socket.io client
│   │   ├── api.ts            # REST API client
│   │   └── localStorage.ts   # Recent whiteboards
│   ├── hooks/
│   │   ├── useCanvas.ts      # Canvas drawing logic
│   │   ├── useWebSocket.ts   # WebSocket connection
│   │   └── useUndoRedo.ts    # Undo/redo stack
│   ├── utils/
│   │   ├── canvas.ts         # Drawing helpers
│   │   ├── quadtree.ts       # Spatial indexing
│   │   └── geometry.ts       # Shape calculations
│   └── types/
│       └── index.ts          # TypeScript definitions
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json

docker-compose.yml            # Local dev environment
README.md
```

**Structure Decision**: Web application structure with separate frontend and backend directories. Frontend uses Vite for fast development and React for UI. Backend uses Express for REST API and Socket.io for WebSocket communication. Both use TypeScript for type safety. PostgreSQL runs in Docker container for local development.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - constitution is template-only with no defined constraints.

## Implementation Phases

### Phase 0: Foundation ✅ COMPLETE

**Deliverables**:
- [x] Research document with technology decisions
- [x] Data model specification
- [x] API contracts (REST + WebSocket)
- [x] Quickstart guide

**Key Decisions Made**:
- Canvas API for rendering (performance over SVG)
- WebSockets for real-time sync (low latency)
- Zustand for state management (lightweight)
- Operational transformation for conflict resolution
- PostgreSQL for persistence (ACID guarantees)
- Browser localStorage for recent whiteboard list

---

### Phase 1: MVP - Basic Drawing (Priority P1)

**Goal**: Single-user whiteboard with basic drawing tools

**User Story Coverage**: User Story 1 (P1)

**Tasks**:

1. **Project Setup**
   - Initialize Vite + React + TypeScript frontend
   - Initialize Node.js + Express + TypeScript backend
   - Setup PostgreSQL with Prisma
   - Configure ESLint, Prettier, Git hooks

2. **Database Schema**
   - Implement Prisma schema from data-model.md
   - Generate and run initial migration
   - Seed development database

3. **Backend - REST API**
   - POST /whiteboards (create whiteboard)
   - GET /whiteboards/:id (retrieve whiteboard)
   - PATCH /whiteboards/:id (update metadata)
   - DELETE /whiteboards/:id (delete whiteboard)
   - Add error handling and validation

4. **Frontend - Canvas Rendering**
   - Create Canvas component with HTML5 canvas
   - Implement pointer event handlers (PointerEvent API)
   - Draw pen/freehand strokes
   - Draw basic shapes: line, rectangle, circle
   - Add text tool with input overlay
   - Implement color picker (minimum 8 colors)
   - Add stroke width selector (1-20px)

5. **Frontend - Tool Toolbar**
   - Create Toolbar component with tool buttons
   - Implement tool selection state (Zustand)
   - Add visual feedback for active tool
   - Add eraser tool

6. **Frontend - Canvas Controls**
   - Implement zoom (10%-400%, mouse wheel + buttons)
   - Implement pan (drag with middle mouse or touch)
   - Maintain canvas transform state
   - Ensure drawings scale correctly with zoom

7. **Testing**
   - Unit tests for canvas drawing functions
   - Unit tests for API endpoints
   - E2E test: Draw on canvas and verify element created
   - E2E test: Use all tools and verify correct rendering

**Acceptance Criteria**:
- ✅ User can open app and see blank canvas
- ✅ User can select tool from toolbar
- ✅ User can draw pen strokes, shapes, and text
- ✅ User can zoom and pan canvas
- ✅ User can erase elements
- ✅ Drawings persist when page is refreshed

**Estimated Effort**: 2-3 weeks

---

### Phase 2: Real-Time Collaboration (Priority P2)

**Goal**: Multi-user whiteboard with real-time synchronization

**User Story Coverage**: User Story 2 (P2)

**Tasks**:

1. **Backend - WebSocket Server**
   - Setup Socket.io server
   - Implement connection/disconnection handlers
   - Implement room join/leave logic
   - Add user session management

2. **Backend - WebSocket Events**
   - Handle `join_whiteboard` event
   - Handle `create_element` event (broadcast to room)
   - Handle `update_element` event (broadcast to room)
   - Handle `delete_element` event (broadcast to room)
   - Persist all events to database

3. **Frontend - WebSocket Client**
   - Setup Socket.io client with reconnection
   - Implement connection state management
   - Add reconnection indicator UI
   - Handle connection errors gracefully

4. **Frontend - Real-Time Sync**
   - Listen for `element_created` events
   - Listen for `element_updated` events
   - Listen for `element_deleted` events
   - Update canvas in real-time
   - Handle offline queue (store actions in memory)

5. **Frontend - Share Dialog**
   - Create ShareDialog component
   - Display shareable URL
   - Add copy-to-clipboard button
   - Show warning about public access

6. **Conflict Resolution**
   - Implement timestamp-based last-write-wins
   - Handle simultaneous element creation (no conflict)
   - Handle simultaneous edits (server timestamp wins)
   - Add optimistic updates with rollback

7. **Testing**
   - Integration test: Two clients connect to same whiteboard
   - Integration test: Draw in client A, verify appears in client B
   - Integration test: Disconnect and reconnect, verify sync
   - Load test: 10 concurrent users on one whiteboard

**Acceptance Criteria**:
- ✅ User can share whiteboard URL
- ✅ Second user can join via URL
- ✅ Changes by one user appear on other screens <2s
- ✅ System handles disconnection gracefully
- ✅ Offline changes sync when reconnected

**Estimated Effort**: 2 weeks

---

### Phase 3: Collaboration Awareness (Priority P3)

**Goal**: Show presence and activity of other users

**User Story Coverage**: User Story 3 (P3)

**Tasks**:

1. **Backend - Cursor Tracking**
   - Handle `cursor_move` event
   - Broadcast cursor position to room (throttled)
   - Track active users per whiteboard

2. **Frontend - Cursor Display**
   - Create UserCursors component
   - Render other users' cursor indicators
   - Display user names/labels
   - Use user-specific colors
   - Animate cursor movements smoothly

3. **Frontend - User List**
   - Display list of active users
   - Show online/offline status
   - Update list when users join/leave

4. **User Identification**
   - Generate UUID on first visit
   - Prompt for optional display name
   - Store in localStorage
   - Assign random color per user

5. **Testing**
   - E2E test: Open two sessions, verify cursor appears
   - E2E test: Move cursor in one session, verify movement in other
   - E2E test: Close session, verify user removed from list

**Acceptance Criteria**:
- ✅ Users see cursors of other active users
- ✅ Cursors show user names and colors
- ✅ User list shows all active collaborators
- ✅ Cursor indicators removed when user leaves

**Estimated Effort**: 1 week

---

### Phase 4: Element Manipulation (Priority P3)

**Goal**: Select, move, resize, and organize elements

**User Story Coverage**: User Story 4 (P3)

**Tasks**:

1. **Frontend - Selection Tool**
   - Add selection tool to toolbar
   - Implement click-to-select element
   - Implement drag-to-select multiple elements
   - Show selection handles on selected elements
   - Add Shift+click for multi-select

2. **Frontend - Transform Operations**
   - Implement drag to move selected elements
   - Implement handle-drag to resize elements
   - Update element positions in real-time
   - Broadcast transforms via WebSocket

3. **Frontend - Z-Index Management**
   - Add "Bring to Front" action
   - Add "Send to Back" action
   - Update z_index on server
   - Re-render canvas with correct layering

4. **Frontend - Delete Action**
   - Add Delete key handler for selected elements
   - Confirm deletion for multiple elements
   - Broadcast deletion via WebSocket

5. **Testing**
   - Unit test: Click element, verify selected state
   - E2E test: Select and move element
   - E2E test: Multi-select with drag box
   - E2E test: Resize element with handles

**Acceptance Criteria**:
- ✅ User can select individual elements
- ✅ User can select multiple elements
- ✅ User can move selected elements
- ✅ User can resize selected elements
- ✅ Changes sync across all users

**Estimated Effort**: 1.5 weeks

---

### Phase 5: Undo/Redo (Priority P3)

**Goal**: Implement action history with undo/redo

**Tasks**:

1. **Frontend - Command Pattern**
   - Create Command interface (execute, undo)
   - Implement commands for: create, move, resize, delete, modify
   - Maintain undo stack (max 50 actions)
   - Maintain redo stack

2. **Frontend - Undo/Redo UI**
   - Add undo button to toolbar (Ctrl+Z)
   - Add redo button to toolbar (Ctrl+Y)
   - Disable buttons when stacks empty
   - Show keyboard shortcuts

3. **Backend - Action Logging**
   - Store DrawingAction records
   - Include before_state and after_state
   - Index by whiteboard_id and timestamp

4. **Synchronization**
   - Broadcast undo/redo events to all users
   - Apply undo/redo on all connected clients
   - Handle undo of actions by other users

5. **Testing**
   - Unit test: Execute command, undo, redo
   - Unit test: Undo stack limited to 50 items
   - E2E test: Draw, undo, redo, verify state
   - E2E test: Undo action syncs to other users

**Acceptance Criteria**:
- ✅ User can undo last 50 actions
- ✅ User can redo undone actions
- ✅ Undo/redo works with keyboard shortcuts
- ✅ Undo/redo syncs across all users

**Estimated Effort**: 1 week

---

### Phase 6: Persistence & Whiteboard List (Priority P4)

**Goal**: Save whiteboards and provide home page with recent list

**User Story Coverage**: User Story 5 (P4)

**Tasks**:

1. **Frontend - Home Page**
   - Create Home component with whiteboard list
   - Load recent whiteboards from localStorage
   - Display thumbnail, title, last accessed date
   - Add "New Whiteboard" button
   - Navigate to whiteboard on click

2. **Frontend - localStorage Service**
   - Save whiteboard metadata on access
   - Limit to 50 most recent whiteboards
   - Generate thumbnail from canvas (base64 PNG)
   - Implement LRU eviction when limit reached

3. **Backend - Thumbnail Generation**
   - Accept thumbnail data in PATCH /whiteboards/:id
   - Store in database (or S3 for production)
   - Validate image format and size

4. **Frontend - Auto-Save**
   - Periodically save thumbnail to server
   - Update localStorage on every whiteboard access
   - Show "Saving..." indicator

5. **Testing**
   - E2E test: Create whiteboard, close, reopen, verify in list
   - E2E test: Access 51 whiteboards, verify oldest evicted
   - Unit test: localStorage service save/load

**Acceptance Criteria**:
- ✅ User sees list of recently accessed whiteboards
- ✅ Whiteboards persist after browser close
- ✅ Thumbnails displayed for each whiteboard
- ✅ List limited to 50 most recent
- ✅ Whiteboard accessible via same URL

**Estimated Effort**: 1 week

---

### Phase 7: Performance Optimization

**Goal**: Ensure smooth performance with 5000+ elements

**Tasks**:

1. **Frontend - Spatial Indexing**
   - Implement quadtree data structure
   - Index elements by position
   - Query only visible elements in viewport
   - Update index on element move/create/delete

2. **Frontend - Canvas Layering**
   - Split canvas into static and active layers
   - Render static layer only when needed
   - Render active layer (current drawing) at 60fps

3. **Frontend - Render Optimization**
   - Implement requestAnimationFrame for smooth drawing
   - Use OffscreenCanvas for background rendering
   - Throttle cursor broadcasts to 30/second
   - Debounce text input updates to 300ms

4. **Backend - Database Optimization**
   - Add composite index: (whiteboard_id, z_index)
   - Add index: (whiteboard_id, updated_at)
   - Implement pagination for large whiteboards
   - Cache recent whiteboards in Redis

5. **Testing**
   - Load test: 5000 elements, measure FPS
   - Load test: 10 concurrent users, measure sync latency
   - Stress test: Rapid element creation, verify no dropped events

**Acceptance Criteria**:
- ✅ 60fps with 5000 elements on canvas
- ✅ <3s load time for 1000 element whiteboard
- ✅ Smooth zoom/pan with large whiteboards
- ✅ <2s sync latency with 10 concurrent users

**Estimated Effort**: 1 week

---

### Phase 8: Production Readiness

**Goal**: Deploy-ready application with monitoring and error handling

**Tasks**:

1. **Error Handling**
   - Comprehensive error boundaries in React
   - Global error handler for API calls
   - WebSocket reconnection with exponential backoff
   - User-friendly error messages

2. **Monitoring**
   - Add structured logging (Winston)
   - Implement health check endpoint
   - Add metrics: connections, elements created, sync latency
   - Setup error tracking (Sentry)

3. **Security**
   - Rate limiting on all endpoints
   - Input validation and sanitization
   - CORS configuration
   - SQL injection prevention (Prisma handles this)
   - XSS prevention (React handles this)

4. **Deployment**
   - Create Dockerfile for backend
   - Create Dockerfile for frontend (nginx)
   - Create docker-compose for full stack
   - Setup CI/CD pipeline (GitHub Actions)
   - Configure production environment variables

5. **Documentation**
   - Complete README with setup instructions
   - API documentation (OpenAPI/Swagger)
   - Architecture diagrams
   - Deployment guide

6. **Testing**
   - Final E2E test suite covering all user stories
   - Performance benchmarks documented
   - Browser compatibility testing

**Acceptance Criteria**:
- ✅ Application runs in Docker containers
- ✅ All tests passing in CI/CD
- ✅ Error tracking and logging operational
- ✅ Complete documentation available
- ✅ Security best practices implemented

**Estimated Effort**: 1-2 weeks

---

## Total Estimated Timeline

- **Phase 1 (MVP)**: 2-3 weeks
- **Phase 2 (Collaboration)**: 2 weeks  
- **Phase 3 (Awareness)**: 1 week
- **Phase 4 (Manipulation)**: 1.5 weeks
- **Phase 5 (Undo/Redo)**: 1 week
- **Phase 6 (Persistence)**: 1 week
- **Phase 7 (Performance)**: 1 week
- **Phase 8 (Production)**: 1-2 weeks

**Total**: 10.5 - 12.5 weeks (2.5 - 3 months)

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| WebSocket connection issues on poor networks | High | Implement exponential backoff, queue offline changes |
| Canvas performance degradation with many elements | High | Spatial indexing, viewport culling, canvas layering |
| Simultaneous edit conflicts | Medium | Timestamp-based conflict resolution, optimistic updates |
| Browser localStorage quota exceeded | Low | Limit to 50 whiteboards, LRU eviction |
| Database bottleneck under load | Medium | Redis caching, database indexing, pagination |

---

## Success Metrics

Track these metrics post-deployment to validate feature success:

- **SC-001**: Time to first draw <3s (measure with RUM)
- **SC-002**: Sync latency <2s (measure with server-side metrics)
- **SC-003**: 10 concurrent users per whiteboard (load test verification)
- **SC-004**: Time to share link <30s (user analytics)
- **SC-005**: 90% successful first draw within 1min (analytics funnel)
- **SC-006**: 5000 elements usable at 60fps (performance benchmarks)
- **SC-007**: <5% data loss/conflict rate (error tracking)
- **SC-008**: 3G collaboration max 5s delay (network throttle testing)

---

## Next Steps

1. ✅ Phase 0 complete (research, data model, contracts)
2. 🔄 Ready to begin Phase 1 (MVP implementation)
3. Run `/speckit.tasks` to generate detailed task breakdown for Phase 1

