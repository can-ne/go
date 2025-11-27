# Data Model: Collaborative Whiteboard

**Date**: November 27, 2025  
**Feature**: [spec.md](./spec.md)  
**Research**: [research.md](./research.md)

## Entity Definitions

### Whiteboard

A canvas containing all drawing elements for a collaboration session.

**Attributes**:
- `id` (UUID, primary key): Unique identifier, used in shareable URL
- `created_at` (timestamp): When whiteboard was created
- `updated_at` (timestamp): Last modification time
- `title` (string, nullable): Optional user-provided name
- `thumbnail` (string, nullable): Base64 or URL to preview image

**Relationships**:
- One-to-many with Element (whiteboard contains multiple elements)

**Validation Rules**:
- `id` must be valid UUID v4
- `title` max length: 100 characters
- `created_at` <= `updated_at`

**Storage**: PostgreSQL table with JSONB for metadata

---

### Element

A single drawable object on the canvas (line, shape, text).

**Attributes**:
- `id` (UUID, primary key): Unique identifier for this element
- `whiteboard_id` (UUID, foreign key): Parent whiteboard
- `type` (enum): One of: `pen`, `line`, `rectangle`, `circle`, `text`
- `x` (float): X coordinate of element origin
- `y` (float): Y coordinate of element origin
- `width` (float, nullable): For rectangles, circles (diameter)
- `height` (float, nullable): For rectangles
- `points` (array of [x,y], nullable): For pen/freehand strokes
- `color` (string): Hex color code (e.g., "#FF0000")
- `stroke_width` (integer): Line thickness in pixels (1-20)
- `content` (string, nullable): Text content for text elements
- `font_size` (integer, nullable): Font size for text (12-72)
- `z_index` (integer): Layer order (0 = bottom)
- `creator_id` (UUID): User who created this element
- `created_at` (timestamp): When element was created
- `updated_at` (timestamp): Last modification time

**Relationships**:
- Many-to-one with Whiteboard
- Many-to-one with User (creator)

**Validation Rules**:
- `type` must be valid enum value
- `color` must match hex pattern: `^#[0-9A-Fa-f]{6}$`
- `stroke_width` between 1 and 20
- `font_size` (if present) between 12 and 72
- `points` required if `type = pen`, must have at least 2 points
- `content` required if `type = text`, max length 1000 characters
- `z_index` >= 0

**State Transitions**:
- Created → Modified (position, size, color changes)
- Modified → Deleted
- No transition back from Deleted (soft delete recommended)

**Storage**: PostgreSQL table with JSONB for `points` array

---

### User (Collaborator)

A person interacting with the whiteboard (anonymous or identified by session).

**Attributes**:
- `id` (UUID, primary key): Session identifier
- `name` (string): Display name (default: "Anonymous User")
- `color` (string): Hex color for cursor indicator
- `created_at` (timestamp): First seen timestamp
- `last_seen_at` (timestamp): Last activity timestamp

**Relationships**:
- One-to-many with Element (user creates multiple elements)
- Many-to-many with Whiteboard (user can access multiple whiteboards)

**Validation Rules**:
- `name` max length: 50 characters
- `color` must match hex pattern: `^#[0-9A-Fa-f]{6}$`
- `last_seen_at` >= `created_at`

**Storage**: In-memory (Redis) for active sessions, PostgreSQL for historical audit

---

### DrawingAction (Event)

A user interaction that creates or modifies elements. Used for undo/redo and real-time sync.

**Attributes**:
- `id` (UUID, primary key): Action identifier
- `whiteboard_id` (UUID): Target whiteboard
- `user_id` (UUID): Actor
- `action_type` (enum): One of: `create`, `move`, `resize`, `delete`, `modify`
- `element_id` (UUID): Target element
- `before_state` (JSONB, nullable): Element state before action (for undo)
- `after_state` (JSONB): Element state after action
- `timestamp` (timestamp with milliseconds): When action occurred

**Relationships**:
- Many-to-one with Whiteboard
- Many-to-one with User
- Many-to-one with Element

**Validation Rules**:
- `action_type` must be valid enum value
- `before_state` required for `move`, `resize`, `modify`, `delete` actions
- `after_state` required for all actions except `delete`
- `timestamp` must be unique per whiteboard (or use sequence)

**State Transitions**:
- Actions are immutable (append-only log)
- Undo creates new action with reversed state

**Storage**: PostgreSQL table (event sourcing pattern), indexed by `whiteboard_id` and `timestamp`

---

## Data Relationships

```
Whiteboard (1) ──── (N) Element
    │
    └── (N) DrawingAction

User (1) ──── (N) Element (creator)
  │
  └── (N) DrawingAction (actor)

Element (1) ──── (N) DrawingAction (target)
```

## Storage Strategy

### PostgreSQL Schema

```sql
CREATE TABLE whiteboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    title VARCHAR(100),
    thumbnail TEXT
);

CREATE TABLE elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whiteboard_id UUID NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('pen', 'line', 'rectangle', 'circle', 'text')),
    x FLOAT NOT NULL,
    y FLOAT NOT NULL,
    width FLOAT,
    height FLOAT,
    points JSONB,
    color VARCHAR(7) NOT NULL,
    stroke_width INTEGER NOT NULL CHECK (stroke_width BETWEEN 1 AND 20),
    content TEXT,
    font_size INTEGER CHECK (font_size BETWEEN 12 AND 72),
    z_index INTEGER NOT NULL DEFAULT 0,
    creator_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_elements_whiteboard ON elements(whiteboard_id);
CREATE INDEX idx_elements_zindex ON elements(whiteboard_id, z_index);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL DEFAULT 'Anonymous User',
    color VARCHAR(7) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drawing_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whiteboard_id UUID NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('create', 'move', 'resize', 'delete', 'modify')),
    element_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_actions_whiteboard ON drawing_actions(whiteboard_id, timestamp DESC);
```

### Browser localStorage Schema

Stored as JSON string under key `whiteboard_recents`:

```json
{
  "whiteboards": [
    {
      "id": "uuid-here",
      "title": "Team Brainstorm",
      "lastAccessed": "2025-11-27T10:30:00Z",
      "thumbnail": "data:image/png;base64,..."
    }
  ],
  "maxItems": 50
}
```

## Data Flow

### Creating an Element

1. User draws on canvas → Frontend captures pointer events
2. Frontend generates Element object with UUID, sends via WebSocket
3. Backend validates, inserts into `elements` table
4. Backend broadcasts to all connected clients
5. Other clients receive and render element

### Syncing on Join

1. Client opens whiteboard URL
2. Client sends `join` WebSocket message with `whiteboard_id`
3. Backend queries all elements: `SELECT * FROM elements WHERE whiteboard_id = ? ORDER BY z_index`
4. Backend sends element array to client
5. Client renders all elements on canvas

### Undo/Redo

1. User clicks undo
2. Frontend pops from undo stack, gets action
3. Frontend applies `before_state` to element, sends `undo` event via WebSocket
4. Backend creates inverse `DrawingAction` record
5. Backend broadcasts to all clients
6. Element reverted on all canvases

## Performance Considerations

- **Indexing**: Composite index on `(whiteboard_id, z_index)` for fast rendering order queries
- **Pagination**: For whiteboards >1000 elements, load in chunks (viewport-based)
- **Caching**: Cache recent whiteboards in Redis (TTL: 1 hour)
- **Archival**: Archive `drawing_actions` older than 30 days to separate table

## Data Retention

- Whiteboards: Indefinite (user controlled)
- Elements: Deleted when parent whiteboard deleted (CASCADE)
- DrawingActions: 30 days (for undo/redo), then archive
- Users: 90 days inactive → soft delete
- localStorage: Browser controlled (typically 5-10MB quota)
