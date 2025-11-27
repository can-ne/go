# REST API Contract

**Feature**: Collaborative Whiteboard  
**Version**: 1.0  
**Base URL**: `/api/v1`

## Endpoints

### 1. Create Whiteboard

**POST** `/whiteboards`

Creates a new whiteboard with a unique ID.

**Request Body**:
```json
{
  "title": "My Whiteboard" // optional
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Whiteboard",
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T10:00:00Z",
  "url": "/w/550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid title (too long)
- `500 Internal Server Error`: Database error

---

### 2. Get Whiteboard

**GET** `/whiteboards/:id`

Retrieves whiteboard metadata and all elements.

**Path Parameters**:
- `id` (UUID): Whiteboard identifier

**Query Parameters**:
- `include_elements` (boolean, default: true): Whether to include elements array
- `limit` (integer, optional): Max elements to return (for pagination)
- `offset` (integer, optional): Skip first N elements

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "My Whiteboard",
  "created_at": "2025-11-27T10:00:00Z",
  "updated_at": "2025-11-27T10:30:00Z",
  "elements": [
    {
      "id": "element-uuid-1",
      "type": "pen",
      "x": 100,
      "y": 150,
      "points": [[100, 150], [110, 160], [120, 155]],
      "color": "#000000",
      "stroke_width": 2,
      "z_index": 0,
      "creator_id": "user-uuid",
      "created_at": "2025-11-27T10:05:00Z"
    },
    {
      "id": "element-uuid-2",
      "type": "rectangle",
      "x": 200,
      "y": 200,
      "width": 100,
      "height": 50,
      "color": "#FF0000",
      "stroke_width": 3,
      "z_index": 1,
      "creator_id": "user-uuid",
      "created_at": "2025-11-27T10:10:00Z"
    },
    {
      "id": "element-uuid-3",
      "type": "text",
      "x": 300,
      "y": 100,
      "content": "Hello World",
      "color": "#0000FF",
      "font_size": 24,
      "z_index": 2,
      "creator_id": "user-uuid",
      "created_at": "2025-11-27T10:15:00Z"
    }
  ],
  "total_elements": 3
}
```

**Error Responses**:
- `404 Not Found`: Whiteboard does not exist
- `500 Internal Server Error`: Database error

---

### 3. Update Whiteboard Metadata

**PATCH** `/whiteboards/:id`

Updates whiteboard title or thumbnail.

**Path Parameters**:
- `id` (UUID): Whiteboard identifier

**Request Body**:
```json
{
  "title": "Updated Title", // optional
  "thumbnail": "data:image/png;base64,..." // optional
}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated Title",
  "updated_at": "2025-11-27T11:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input
- `404 Not Found`: Whiteboard does not exist
- `500 Internal Server Error`: Database error

---

### 4. Delete Whiteboard

**DELETE** `/whiteboards/:id`

Deletes a whiteboard and all its elements.

**Path Parameters**:
- `id` (UUID): Whiteboard identifier

**Response** (204 No Content)

**Error Responses**:
- `404 Not Found`: Whiteboard does not exist
- `500 Internal Server Error`: Database error

---

### 5. Health Check

**GET** `/health`

Returns server status.

**Response** (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2025-11-27T10:00:00Z",
  "version": "1.0.0"
}
```

---

## Common Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Database down |

## Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "WHITEBOARD_NOT_FOUND",
    "message": "Whiteboard with id 550e8400-e29b-41d4-a716-446655440000 does not exist",
    "timestamp": "2025-11-27T10:00:00Z"
  }
}
```

## Rate Limiting

- Anonymous users: 100 requests per minute per IP
- Whiteboard creation: 10 per hour per IP
- All other endpoints: 1000 requests per minute per IP

**Rate limit response** (429 Too Many Requests):
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "retry_after": 60
  }
}
```

## CORS Configuration

- **Allowed Origins**: All (`*`) - public API
- **Allowed Methods**: GET, POST, PATCH, DELETE, OPTIONS
- **Allowed Headers**: Content-Type, Authorization
- **Max Age**: 86400 seconds (24 hours)
