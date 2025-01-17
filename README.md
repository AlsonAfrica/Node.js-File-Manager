# Shopping List API

A RESTful API for managing shopping lists built with Node.js and Express. This API provides basic CRUD operations for shopping list items using a JSON file for data persistence.

## Features

- Create new shopping list items
- Retrieve all items or a single item
- Update existing items
- Delete items
- Persistent storage using JSON file
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Technologies
- Node
- Javascript

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AlsonAfrica/Node.js-File-Manager.git
cd Node.js-File-Manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
nodemon server.js or node server.js
```

The server will start on `http://localhost:5002` by default.

## API Endpoints

### GET /api/items
Returns all shopping list items.

Response:
```json
[
  {
    "id": "1",
    "name": "Milk",
    "quantity": 1,
    "completed": false
  }
]
```

### GET /api/items/:id
Returns a specific item by ID.

Response:
```json
{
  "id": "1",
  "name": "Milk",
  "quantity": 1,
  "completed": false
}
```

### POST /api/items
Creates a new shopping list item.

Request body:
```json
{
  "name": "Bread",
  "quantity": 2,
  "completed": false
}
```

### PUT /api/items/:id
Updates an existing item.

Request body:
```json
{
  "name": "Bread",
  "quantity": 3,
  "completed": true
}
```

### DELETE /api/items/:id
Deletes an item from the shopping list.

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## Data Structure

Items are stored in a JSON file with the following structure:
```json
{
  "id": "string",
  "name": "string",
  "quantity": "number",
  "completed": "boolean",
  "createdAt": "string",
  "updatedAt": "string"
}
```

## Development

1. Install development dependencies:
```bash
npm install --save-dev nodemon
```

2. Run in development mode:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
