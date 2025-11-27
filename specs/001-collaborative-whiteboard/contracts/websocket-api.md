# WebSocket API Contract

**Feature**: Collaborative Whiteboard  
**Version**: 1.0  
**Protocol**: Socket.io v4

## Connection

### Endpoint

```
ws://localhost:3000/whiteboard
```

### Authentication

No authentication required (public access model).

### Connection Events

#### `connect`

Emitted when client successfully connects to server.

**Server → Client**:
```json
{
  "session_id": "user-uuid",
  "server_time": "2025-11-27T10:00:00Z"
}
```

#### `disconnect`

Emitted when connection is closed.

**Reason codes**:
- `transport close`: Network issue
- `server disconnect`: Server initiated
- `client disconnect`: Client initiated

---

## Room Management

### `join_whiteboard`

Client joins a whiteboard room to receive real-time updates.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "name": "Alice",
    "color": "#FF5733"
  }
}
```

**Server → Client** (success):
```json
{
  "type": "join_success",
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-uuid",
  "active_users": [
    {
      "id": "user-uuid-1",
      "name": "Bob",
      "color": "#33FF57"
    },
    {
      "id": "user-uuid-2",
      "name": "Carol",
      "color": "#3357FF"
    }
  ]
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "user_joined",
  "user": {
    "id": "user-uuid",
    "name": "Alice",
    "color": "#FF5733"
  }
}
```

**Server → Client** (error):
```json
{
  "type": "error",
  "code": "WHITEBOARD_NOT_FOUND",
  "message": "Whiteboard does not exist"
}
```

---

### `leave_whiteboard`

Client leaves a whiteboard room.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "user_left",
  "user_id": "user-uuid"
}
```

---

## Drawing Operations

### `create_element`

Creates a new element on the whiteboard.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "element": {
    "id": "element-uuid",
    "type": "pen",
    "x": 100,
    "y": 150,
    "points": [[100, 150], [110, 160], [120, 155]],
    "color": "#000000",
    "stroke_width": 2,
    "z_index": 0
  }
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "element_created",
  "element": {
    "id": "element-uuid",
    "type": "pen",
    "x": 100,
    "y": 150,
    "points": [[100, 150], [110, 160], [120, 155]],
    "color": "#000000",
    "stroke_width": 2,
    "z_index": 0,
    "creator_id": "user-uuid",
    "created_at": "2025-11-27T10:05:00Z"
  }
}
```

**Rate Limit**: 100 elements per minute per user

---

### `update_element`

Updates an existing element (move, resize, modify).

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "element_id": "element-uuid",
  "changes": {
    "x": 150,
    "y": 200,
    "width": 120
  }
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "element_updated",
  "element_id": "element-uuid",
  "changes": {
    "x": 150,
    "y": 200,
    "width": 120
  },
  "updated_at": "2025-11-27T10:10:00Z"
}
```

---

### `delete_element`

Deletes an element from the whiteboard.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "element_id": "element-uuid"
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "element_deleted",
  "element_id": "element-uuid",
  "deleted_at": "2025-11-27T10:15:00Z"
}
```

---

## Cursor Tracking

### `cursor_move`

Broadcasts cursor position to other users.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "x": 250,
  "y": 300
}
```

**Server → All Other Clients in Room** (broadcast, excludes sender):
```json
{
  "type": "cursor_moved",
  "user_id": "user-uuid",
  "x": 250,
  "y": 300
}
```

**Throttling**: Max 30 updates per second per user (client-side throttle recommended)

---

## Undo/Redo

### `undo`

Reverts the last action.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "action_id": "action-uuid"
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "action_undone",
  "action_id": "action-uuid",
  "element_id": "element-uuid",
  "previous_state": {
    "x": 100,
    "y": 150
  }
}
```

### `redo`

Reapplies a previously undone action.

**Client → Server**:
```json
{
  "whiteboard_id": "550e8400-e29b-41d4-a716-446655440000",
  "action_id": "action-uuid"
}
```

**Server → All Clients in Room** (broadcast):
```json
{
  "type": "action_redone",
  "action_id": "action-uuid",
  "element_id": "element-uuid",
  "restored_state": {
    "x": 150,
    "y": 200
  }
}
```

---

## Connection Recovery

### `reconnect`

Automatically emitted by Socket.io on reconnection.

**Server → Client**:
```json
{
  "type": "reconnected",
  "missed_updates": [
    {
      "type": "element_created",
      "element": { /* ... */ },
      "timestamp": "2025-11-27T10:20:00Z"
    },
    {
      "type": "element_updated",
      "element_id": "element-uuid",
      "changes": { /* ... */ },
      "timestamp": "2025-11-27T10:21:00Z"
    }
  ]
}
```

**Reconciliation Strategy**:
1. Client stores last known server timestamp
2. On reconnect, server sends all events since that timestamp
3. Client applies events in order to catch up

---

## Error Handling

### Error Message Format

```json
{
  "type": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "timestamp": "2025-11-27T10:00:00Z"
}
```

### Error Codes

| Code | Meaning | Client Action |
|------|---------|---------------|
| `WHITEBOARD_NOT_FOUND` | Whiteboard doesn't exist | Redirect to home |
| `ELEMENT_NOT_FOUND` | Element doesn't exist | Refresh whiteboard |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Throttle actions |
| `INVALID_DATA` | Malformed request | Validate input |
| `SERVER_ERROR` | Internal server error | Retry with backoff |
| `UNAUTHORIZED` | Access denied | Show error message |

---

## Connection States

### Client-Side State Machine

```
DISCONNECTED → CONNECTING → CONNECTED → JOINED_ROOM
      ↑____________|              |____________↓
          (on error)          (on disconnect)
```

### Heartbeat

- Client sends `ping` every 25 seconds
- Server responds with `pong`
- If no `pong` received in 30 seconds, consider connection dead

**Client → Server**:
```json
{ "type": "ping" }
```

**Server → Client**:
```json
{ "type": "pong", "server_time": "2025-11-27T10:00:00Z" }
```

---

## Performance Guidelines

### Client-Side Optimizations

1. **Throttle cursor updates**: Max 30/second
2. **Batch element updates**: Collect changes over 100ms, send as single update
3. **Debounce text input**: Send text element updates after 300ms idle
4. **Local prediction**: Apply changes immediately, reconcile on server response

### Server-Side Optimizations

1. **Room-based broadcasting**: Only send to users in same whiteboard
2. **Binary protocol**: Use MessagePack for large element arrays (optional)
3. **Compression**: Enable WebSocket compression for payloads >1KB

---

## Example Flow: Collaborative Drawing

```
User A                  Server                  User B
  |                       |                       |
  |--join_whiteboard----->|                       |
  |<---join_success-------|                       |
  |                       |<---join_whiteboard----|
  |                       |----join_success------>|
  |                       |----user_joined------->|
  |                       |                       |
  |--create_element------>|                       |
  |                       |--element_created----->|
  |<--element_created-----|                       |
  |                       |                       |
  |                       |<---cursor_move--------|
  |<--cursor_moved--------|                       |
  |                       |                       |
  |--update_element------>|                       |
  |                       |--element_updated----->|
  |<--element_updated-----|                       |
```
