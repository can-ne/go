# Tasks: Collaborative Whiteboard Web App

**Input**: Design documents from `/specs/001-collaborative-whiteboard/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification, so test tasks are excluded from this breakdown.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- All paths use the web application structure: `backend/src/` and `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project directory structure: backend/, frontend/, docker-compose.yml
- [ ] T002 Initialize frontend with Vite + React + TypeScript in frontend/
- [ ] T003 [P] Initialize backend with Node.js + Express + TypeScript in backend/
- [ ] T004 [P] Setup PostgreSQL database with Docker in docker-compose.yml
- [ ] T005 [P] Initialize Prisma ORM in backend/prisma/schema.prisma
- [ ] T006 [P] Configure ESLint and Prettier for both frontend and backend
- [ ] T007 [P] Setup Git hooks for linting in .husky/
- [ ] T008 Create README.md with setup instructions from quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 Implement Prisma schema from data-model.md in backend/prisma/schema.prisma
- [ ] T010 Generate Prisma client and run initial migration in backend/
- [ ] T011 [P] Create Express server setup in backend/src/index.ts
- [ ] T012 [P] Setup CORS and middleware in backend/src/index.ts
- [ ] T013 [P] Create error handling utilities in backend/src/utils/errors.ts
- [ ] T014 [P] Create validation utilities in backend/src/utils/validation.ts
- [ ] T015 [P] Setup React Router in frontend/src/App.tsx
- [ ] T016 [P] Create TypeScript type definitions in frontend/src/types/index.ts
- [ ] T017 [P] Create API client service in frontend/src/services/api.ts
- [ ] T018 [P] Create base Zustand store structure in frontend/src/stores/
- [ ] T019 [P] Configure Vite environment variables in frontend/.env
- [ ] T020 [P] Configure backend environment variables in backend/.env

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Draw on Personal Whiteboard (Priority: P1) 🎯 MVP

**Goal**: Single-user whiteboard with basic drawing tools (pen, shapes, text, zoom, pan, erase)

**Independent Test**: Open app, select tool, draw on canvas, zoom/pan, erase elements, refresh page to verify persistence

### Backend Implementation for User Story 1

- [ ] T021 [P] [US1] Create whiteboard service in backend/src/services/whiteboard.service.ts
- [ ] T022 [P] [US1] Create element service in backend/src/services/element.service.ts
- [ ] T023 [US1] Implement POST /api/v1/whiteboards endpoint in backend/src/routes/whiteboards.ts
- [ ] T024 [US1] Implement GET /api/v1/whiteboards/:id endpoint in backend/src/routes/whiteboards.ts
- [ ] T025 [US1] Implement PATCH /api/v1/whiteboards/:id endpoint in backend/src/routes/whiteboards.ts
- [ ] T026 [US1] Implement DELETE /api/v1/whiteboards/:id endpoint in backend/src/routes/whiteboards.ts
- [ ] T027 [US1] Add request validation for all whiteboard endpoints in backend/src/routes/whiteboards.ts
- [ ] T028 [US1] Register whiteboard routes in backend/src/index.ts

### Frontend - Canvas Core for User Story 1

- [ ] T029 [P] [US1] Create Whiteboard page component in frontend/src/pages/Whiteboard.tsx
- [ ] T030 [P] [US1] Create Canvas component with HTML5 canvas ref in frontend/src/components/Canvas.tsx
- [ ] T031 [US1] Implement PointerEvent handlers (down, move, up) in frontend/src/components/Canvas.tsx
- [ ] T032 [US1] Create canvas drawing utilities in frontend/src/utils/canvas.ts
- [ ] T033 [US1] Create geometry calculation utilities in frontend/src/utils/geometry.ts

### Frontend - Drawing Tools for User Story 1

- [ ] T034 [P] [US1] Implement pen/freehand drawing in frontend/src/components/Canvas.tsx
- [ ] T035 [P] [US1] Implement line drawing in frontend/src/components/Canvas.tsx
- [ ] T036 [P] [US1] Implement rectangle drawing in frontend/src/components/Canvas.tsx
- [ ] T037 [P] [US1] Implement circle drawing in frontend/src/components/Canvas.tsx
- [ ] T038 [US1] Implement text tool with input overlay in frontend/src/components/Canvas.tsx
- [ ] T039 [US1] Implement eraser tool in frontend/src/components/Canvas.tsx

### Frontend - Toolbar for User Story 1

- [ ] T040 [US1] Create Toolbar component in frontend/src/components/Toolbar.tsx
- [ ] T041 [US1] Add tool selection buttons (pen, line, rectangle, circle, text, eraser) in frontend/src/components/Toolbar.tsx
- [ ] T042 [US1] Create ColorPicker component (minimum 8 colors) in frontend/src/components/ColorPicker.tsx
- [ ] T043 [US1] Add stroke width selector (1-20px) in frontend/src/components/Toolbar.tsx
- [ ] T044 [US1] Implement tool selection state in Zustand store in frontend/src/stores/whiteboardStore.ts

### Frontend - Canvas Controls for User Story 1

- [ ] T045 [US1] Implement zoom controls (10%-400%) with mouse wheel in frontend/src/components/Canvas.tsx
- [ ] T046 [US1] Implement pan functionality (drag with middle mouse or touch) in frontend/src/components/Canvas.tsx
- [ ] T047 [US1] Add zoom buttons (+/-) to toolbar in frontend/src/components/Toolbar.tsx
- [ ] T048 [US1] Maintain canvas transform state (zoom, pan offset) in frontend/src/stores/whiteboardStore.ts
- [ ] T049 [US1] Ensure drawings scale correctly with zoom in frontend/src/components/Canvas.tsx

### Frontend - Persistence for User Story 1

- [ ] T050 [US1] Create elements state in Zustand store in frontend/src/stores/whiteboardStore.ts
- [ ] T051 [US1] Send element create actions to REST API in frontend/src/services/api.ts
- [ ] T052 [US1] Load whiteboard elements on page load in frontend/src/pages/Whiteboard.tsx
- [ ] T053 [US1] Handle element delete via API in frontend/src/services/api.ts

**Checkpoint**: User Story 1 complete - basic single-user whiteboard functional and testable

---

## Phase 4: User Story 2 - Share Whiteboard with Collaborators (Priority: P2)

**Goal**: Multi-user real-time collaboration via shareable links with <2s sync latency

**Independent Test**: Create whiteboard, copy share link, open in second browser, draw in first browser, verify appears in second within 2 seconds

### Backend - WebSocket Server for User Story 2

- [ ] T054 [US2] Setup Socket.io server in backend/src/index.ts
- [ ] T055 [US2] Create WebSocket handlers file in backend/src/socket/handlers.ts
- [ ] T056 [US2] Implement connection/disconnection handlers in backend/src/socket/handlers.ts
- [ ] T057 [US2] Implement room join/leave logic in backend/src/socket/handlers.ts
- [ ] T058 [US2] Add user session management in backend/src/socket/handlers.ts

### Backend - WebSocket Events for User Story 2

- [ ] T059 [P] [US2] Handle join_whiteboard event in backend/src/socket/handlers.ts
- [ ] T060 [P] [US2] Handle create_element event with broadcast in backend/src/socket/handlers.ts
- [ ] T061 [P] [US2] Handle update_element event with broadcast in backend/src/socket/handlers.ts
- [ ] T062 [P] [US2] Handle delete_element event with broadcast in backend/src/socket/handlers.ts
- [ ] T063 [US2] Persist WebSocket events to database in backend/src/socket/handlers.ts

### Frontend - WebSocket Client for User Story 2

- [ ] T064 [US2] Create WebSocket service with Socket.io client in frontend/src/services/websocket.ts
- [ ] T065 [US2] Implement connection state management in frontend/src/stores/whiteboardStore.ts
- [ ] T066 [US2] Add reconnection indicator UI in frontend/src/components/Whiteboard.tsx
- [ ] T067 [US2] Handle connection errors with user-friendly messages in frontend/src/services/websocket.ts

### Frontend - Real-Time Sync for User Story 2

- [ ] T068 [P] [US2] Listen for element_created events in frontend/src/services/websocket.ts
- [ ] T069 [P] [US2] Listen for element_updated events in frontend/src/services/websocket.ts
- [ ] T070 [P] [US2] Listen for element_deleted events in frontend/src/services/websocket.ts
- [ ] T071 [US2] Update canvas in real-time on WebSocket events in frontend/src/components/Canvas.tsx
- [ ] T072 [US2] Handle offline queue (store actions in memory) in frontend/src/stores/whiteboardStore.ts
- [ ] T073 [US2] Sync offline changes when reconnected in frontend/src/services/websocket.ts

### Frontend - Share Dialog for User Story 2

- [ ] T074 [US2] Create ShareDialog component in frontend/src/components/ShareDialog.tsx
- [ ] T075 [US2] Display shareable URL in share dialog in frontend/src/components/ShareDialog.tsx
- [ ] T076 [US2] Add copy-to-clipboard button in frontend/src/components/ShareDialog.tsx
- [ ] T077 [US2] Show warning about public access in frontend/src/components/ShareDialog.tsx
- [ ] T078 [US2] Add share button to toolbar in frontend/src/components/Toolbar.tsx

### Conflict Resolution for User Story 2

- [ ] T079 [US2] Implement timestamp-based last-write-wins in backend/src/socket/handlers.ts
- [ ] T080 [US2] Handle simultaneous element creation (UUID prevents conflicts) in backend/src/socket/handlers.ts
- [ ] T081 [US2] Add optimistic updates with rollback in frontend/src/stores/whiteboardStore.ts

**Checkpoint**: User Story 2 complete - real-time collaboration functional, US1 still works independently

---

## Phase 5: User Story 3 - See Who's Online and Where They're Working (Priority: P3)

**Goal**: Display presence indicators showing active users and their cursor positions

**Independent Test**: Open whiteboard in two sessions, move cursor in one, verify cursor indicator appears in other with user name and color

### Backend - Cursor Tracking for User Story 3

- [ ] T082 [US3] Handle cursor_move event in backend/src/socket/handlers.ts
- [ ] T083 [US3] Broadcast cursor positions to room (server-side throttling) in backend/src/socket/handlers.ts
- [ ] T084 [US3] Track active users per whiteboard in backend/src/socket/handlers.ts
- [ ] T085 [US3] Broadcast user_joined event in backend/src/socket/handlers.ts
- [ ] T086 [US3] Broadcast user_left event in backend/src/socket/handlers.ts

### Frontend - User Identification for User Story 3

- [ ] T087 [P] [US3] Generate UUID on first visit in frontend/src/services/localStorage.ts
- [ ] T088 [P] [US3] Create user store in frontend/src/stores/userStore.ts
- [ ] T089 [US3] Prompt for optional display name in frontend/src/components/Whiteboard.tsx
- [ ] T090 [US3] Assign random color per user in frontend/src/stores/userStore.ts
- [ ] T091 [US3] Store user info in localStorage in frontend/src/services/localStorage.ts

### Frontend - Cursor Display for User Story 3

- [ ] T092 [US3] Create UserCursors component in frontend/src/components/UserCursors.tsx
- [ ] T093 [US3] Render other users' cursor indicators in frontend/src/components/UserCursors.tsx
- [ ] T094 [US3] Display user names/labels with cursors in frontend/src/components/UserCursors.tsx
- [ ] T095 [US3] Apply user-specific colors to cursors in frontend/src/components/UserCursors.tsx
- [ ] T096 [US3] Animate cursor movements smoothly in frontend/src/components/UserCursors.tsx
- [ ] T097 [US3] Throttle cursor broadcasts to 30/second (client-side) in frontend/src/services/websocket.ts

### Frontend - User List for User Story 3

- [ ] T098 [US3] Display list of active users in frontend/src/components/Whiteboard.tsx
- [ ] T099 [US3] Show online/offline status in user list in frontend/src/components/Whiteboard.tsx
- [ ] T100 [US3] Update list when users join/leave in frontend/src/stores/whiteboardStore.ts

**Checkpoint**: User Story 3 complete - presence awareness functional, US1 and US2 still work independently

---

## Phase 6: User Story 4 - Select and Move Elements (Priority: P3)

**Goal**: Enable element selection, movement, resizing, and layer management

**Independent Test**: Draw multiple elements, switch to selection tool, click element to select, drag to move, verify position updates

### Frontend - Selection Tool for User Story 4

- [ ] T101 [US4] Add selection tool to toolbar in frontend/src/components/Toolbar.tsx
- [ ] T102 [US4] Implement click-to-select element in frontend/src/components/Canvas.tsx
- [ ] T103 [US4] Implement drag-to-select multiple elements in frontend/src/components/Canvas.tsx
- [ ] T104 [US4] Show selection handles on selected elements in frontend/src/components/Canvas.tsx
- [ ] T105 [US4] Add Shift+click for multi-select in frontend/src/components/Canvas.tsx
- [ ] T106 [US4] Maintain selection state in Zustand store in frontend/src/stores/whiteboardStore.ts

### Frontend - Transform Operations for User Story 4

- [ ] T107 [US4] Implement drag to move selected elements in frontend/src/components/Canvas.tsx
- [ ] T108 [US4] Implement handle-drag to resize elements in frontend/src/components/Canvas.tsx
- [ ] T109 [US4] Update element positions in real-time during drag in frontend/src/components/Canvas.tsx
- [ ] T110 [US4] Broadcast transform updates via WebSocket in frontend/src/services/websocket.ts

### Frontend - Z-Index Management for User Story 4

- [ ] T111 [US4] Add "Bring to Front" button/action in frontend/src/components/Toolbar.tsx
- [ ] T112 [US4] Add "Send to Back" button/action in frontend/src/components/Toolbar.tsx
- [ ] T113 [US4] Update z_index on server via API in frontend/src/services/api.ts
- [ ] T114 [US4] Re-render canvas with correct layering in frontend/src/components/Canvas.tsx

### Frontend - Delete Action for User Story 4

- [ ] T115 [US4] Add Delete key handler for selected elements in frontend/src/components/Canvas.tsx
- [ ] T116 [US4] Confirm deletion for multiple elements in frontend/src/components/Canvas.tsx
- [ ] T117 [US4] Broadcast deletion via WebSocket in frontend/src/services/websocket.ts

**Checkpoint**: User Story 4 complete - element manipulation functional, all previous stories still work

---

## Phase 7: User Story 5 - Save and Resume Whiteboards (Priority: P4)

**Goal**: Persist whiteboards with home page showing recently accessed list

**Independent Test**: Create content, close browser, reopen app, verify whiteboard in recent list with thumbnail

### Frontend - Home Page for User Story 5

- [ ] T118 [US5] Create Home page component in frontend/src/pages/Home.tsx
- [ ] T119 [US5] Load recent whiteboards from localStorage in frontend/src/pages/Home.tsx
- [ ] T120 [US5] Display whiteboard list with thumbnails in frontend/src/pages/Home.tsx
- [ ] T121 [US5] Display title and last accessed date for each in frontend/src/pages/Home.tsx
- [ ] T122 [US5] Add "New Whiteboard" button in frontend/src/pages/Home.tsx
- [ ] T123 [US5] Navigate to whiteboard on click in frontend/src/pages/Home.tsx
- [ ] T124 [US5] Update router to show Home as landing page in frontend/src/App.tsx

### Frontend - localStorage Service for User Story 5

- [ ] T125 [US5] Create localStorage service in frontend/src/services/localStorage.ts
- [ ] T126 [US5] Save whiteboard metadata on access in frontend/src/services/localStorage.ts
- [ ] T127 [US5] Implement 50 whiteboard limit with LRU eviction in frontend/src/services/localStorage.ts
- [ ] T128 [US5] Generate thumbnail from canvas (base64 PNG) in frontend/src/utils/canvas.ts
- [ ] T129 [US5] Store thumbnail in localStorage in frontend/src/services/localStorage.ts

### Backend - Thumbnail Storage for User Story 5

- [ ] T130 [US5] Add thumbnail field handling in PATCH endpoint in backend/src/routes/whiteboards.ts
- [ ] T131 [US5] Validate thumbnail format and size in backend/src/utils/validation.ts
- [ ] T132 [US5] Store thumbnail in database in backend/src/services/whiteboard.service.ts

### Frontend - Auto-Save for User Story 5

- [ ] T133 [US5] Implement periodic thumbnail save to server in frontend/src/pages/Whiteboard.tsx
- [ ] T134 [US5] Update localStorage on every whiteboard access in frontend/src/pages/Whiteboard.tsx
- [ ] T135 [US5] Show "Saving..." indicator in frontend/src/components/Whiteboard.tsx

**Checkpoint**: User Story 5 complete - all 5 user stories functional and independently testable

---

## Phase 8: Undo/Redo Implementation

**Purpose**: Add undo/redo functionality (crosses multiple stories)

- [ ] T136 [P] Create Command interface in frontend/src/utils/commands.ts
- [ ] T137 [P] Implement CreateCommand in frontend/src/utils/commands.ts
- [ ] T138 [P] Implement MoveCommand in frontend/src/utils/commands.ts
- [ ] T139 [P] Implement ResizeCommand in frontend/src/utils/commands.ts
- [ ] T140 [P] Implement DeleteCommand in frontend/src/utils/commands.ts
- [ ] T141 [P] Implement ModifyCommand in frontend/src/utils/commands.ts
- [ ] T142 Create useUndoRedo hook in frontend/src/hooks/useUndoRedo.ts
- [ ] T143 Maintain undo stack (max 50 actions) in frontend/src/hooks/useUndoRedo.ts
- [ ] T144 Maintain redo stack in frontend/src/hooks/useUndoRedo.ts
- [ ] T145 Add undo button (Ctrl+Z) to toolbar in frontend/src/components/Toolbar.tsx
- [ ] T146 Add redo button (Ctrl+Y) to toolbar in frontend/src/components/Toolbar.tsx
- [ ] T147 Disable buttons when stacks empty in frontend/src/components/Toolbar.tsx
- [ ] T148 Broadcast undo/redo events to other users in frontend/src/services/websocket.ts
- [ ] T149 Handle undo_action event in backend/src/socket/handlers.ts
- [ ] T150 Store DrawingAction records in database in backend/src/services/element.service.ts

---

## Phase 9: Performance Optimization

**Purpose**: Ensure smooth 60fps performance with 5000+ elements

- [ ] T151 Implement quadtree data structure in frontend/src/utils/quadtree.ts
- [ ] T152 Index elements by position in quadtree in frontend/src/stores/whiteboardStore.ts
- [ ] T153 Query only visible elements in viewport in frontend/src/components/Canvas.tsx
- [ ] T154 Update quadtree index on element operations in frontend/src/stores/whiteboardStore.ts
- [ ] T155 Split canvas into static and active layers in frontend/src/components/Canvas.tsx
- [ ] T156 Render static layer only when needed in frontend/src/components/Canvas.tsx
- [ ] T157 Render active layer at 60fps with requestAnimationFrame in frontend/src/components/Canvas.tsx
- [ ] T158 Use OffscreenCanvas for background rendering in frontend/src/utils/canvas.ts
- [ ] T159 Add composite index (whiteboard_id, z_index) in backend/prisma/schema.prisma
- [ ] T160 Add index (whiteboard_id, updated_at) in backend/prisma/schema.prisma
- [ ] T161 Implement pagination for large whiteboards in backend/src/routes/whiteboards.ts
- [ ] T162 Add Redis caching for recent whiteboards in backend/src/services/whiteboard.service.ts

---

## Phase 10: Polish & Production Readiness

**Purpose**: Deploy-ready application with monitoring and security

- [ ] T163 [P] Add React error boundaries in frontend/src/components/ErrorBoundary.tsx
- [ ] T164 [P] Create global error handler for API calls in frontend/src/services/api.ts
- [ ] T165 [P] Implement WebSocket reconnection with exponential backoff in frontend/src/services/websocket.ts
- [ ] T166 [P] Add structured logging with Winston in backend/src/utils/logger.ts
- [ ] T167 [P] Implement health check endpoint in backend/src/routes/health.ts
- [ ] T168 [P] Add rate limiting to all endpoints in backend/src/index.ts
- [ ] T169 [P] Add input validation and sanitization in backend/src/utils/validation.ts
- [ ] T170 [P] Create Dockerfile for backend in backend/Dockerfile
- [ ] T171 [P] Create Dockerfile for frontend in frontend/Dockerfile
- [ ] T172 Update docker-compose.yml for full stack deployment
- [ ] T173 [P] Setup GitHub Actions CI/CD in .github/workflows/
- [ ] T174 [P] Configure production environment variables
- [ ] T175 [P] Add API documentation with OpenAPI/Swagger in backend/docs/
- [ ] T176 Update README.md with deployment guide
- [ ] T177 Validate quickstart.md instructions with fresh setup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Setup - BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Foundational - Can start after Phase 2 complete
- **Phase 4 (US2)**: Depends on Foundational - Can start after Phase 2 complete (parallel with US1 if staffed)
- **Phase 5 (US3)**: Depends on Foundational + US2 WebSocket - Can start after Phase 4 complete
- **Phase 6 (US4)**: Depends on Foundational + US1 Canvas - Can start after Phase 3 complete (parallel with US2/US3)
- **Phase 7 (US5)**: Depends on Foundational + US1 Canvas - Can start after Phase 3 complete (parallel with others)
- **Phase 8 (Undo/Redo)**: Depends on US1 + US4 complete
- **Phase 9 (Performance)**: Depends on all user stories complete
- **Phase 10 (Production)**: Depends on all features complete

### User Story Dependencies

- **User Story 1 (P1) - MVP**: Independent after Foundational
- **User Story 2 (P2)**: Integrates with US1 but independently testable
- **User Story 3 (P3)**: Requires US2 WebSocket infrastructure
- **User Story 4 (P3)**: Requires US1 Canvas, independently testable
- **User Story 5 (P4)**: Requires US1 Canvas, independently testable

### Parallel Opportunities per Phase

**Phase 1 (Setup)**: T002, T003, T004, T005, T006, T007 can run in parallel

**Phase 2 (Foundational)**: T011-T020 can run in parallel (after T009-T010)

**Phase 3 (US1)**:
- T021, T022 in parallel
- T029, T030, T032, T033 in parallel (after backend ready)
- T034-T037, T042 in parallel (drawing tools)

**Phase 4 (US2)**:
- T059-T062 in parallel
- T068-T070 in parallel

**Phase 8 (Undo/Redo)**: T136-T141 in parallel

**Phase 10 (Polish)**: T163-T165, T166-T169, T170-T171, T173-T176 in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T020) - CRITICAL CHECKPOINT
3. Complete Phase 3: User Story 1 (T021-T053) - MVP COMPLETE
4. **STOP and VALIDATE**: Test basic whiteboard independently
5. Deploy/demo MVP

**MVP Delivery**: After Phase 3, you have a working single-user whiteboard (estimated 2-3 weeks)

### Incremental Delivery (Recommended)

1. **Foundation** (Phase 1 + 2): Setup + Core infrastructure
2. **MVP** (Phase 3): Single-user drawing → Deploy
3. **Collaboration** (Phase 4): Real-time sync → Deploy
4. **Awareness** (Phase 5): Presence indicators → Deploy
5. **Manipulation** (Phase 6): Selection/transform → Deploy
6. **Persistence** (Phase 7): Whiteboard list → Deploy
7. **Polish** (Phases 8-10): Undo/redo, performance, production

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 3+ developers after Foundational phase complete:

- **Developer A**: User Story 1 (Phase 3) - Core drawing
- **Developer B**: User Story 2 (Phase 4) - Collaboration (waits for basic canvas)
- **Developer C**: User Story 5 (Phase 7) - Persistence (parallel with US1)

Then continue with US3, US4, optimization, and production readiness.

---

## Notes

- **Total tasks**: 177 tasks across 10 phases
- **MVP subset**: 53 tasks (T001-T053) for basic functional whiteboard
- **Estimated timeline**: 10.5-12.5 weeks total (see plan.md)
- **MVP timeline**: 2-3 weeks for Phase 1-3
- All tasks include explicit file paths for clarity
- [P] markers indicate parallelizable tasks (different files)
- [US#] markers link tasks to specific user stories
- Tests intentionally excluded per specification (no TDD requirement)
- Each checkpoint allows for independent validation
- User stories designed to be independently deliverable
