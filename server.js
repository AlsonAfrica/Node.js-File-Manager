const fs = require('fs');
const path = require('path');
const http = require('http');

const filePath = path.join('shoppingListDirectory', 'shoppingList.json');

// Ensure the directory exists and initialize an empty file
fs.mkdir('shoppingListDirectory', { recursive: true }, (error) => {
    if (error) {
        return console.error('Error creating directory', error);
    }

    // Initialize shopping list JSON file if it doesn't exist
    fs.writeFile(filePath, JSON.stringify([], null, 2), { flag: 'wx' }, (err) => {
        if (err && err.code !== 'EEXIST') {
            return console.error('Error creating shopping list file:', err);
        }
        console.log('Shopping list file is ready!');

        const server = http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json');
            const urlParts = req.url.split('/');
            const isShoppingList = urlParts[1] === 'shopping-list';
            const itemId = parseInt(urlParts[2], 10); // Extract item ID if present

            if (isShoppingList) {
                // GET all items or a specific item
                if (req.method === 'GET') {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ error: 'Error reading shopping list' }));
                        }
                        let shoppingList;
                        try {
                            shoppingList = JSON.parse(data);
                        } catch (parseError) {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ error: 'Error parsing shopping list data' }));
                        }

                        // If an item ID is specified in the URL, return that item
                        if (itemId) {
                            const item = shoppingList.find(item => item.id === itemId);
                            if (item) {
                                res.writeHead(200);
                                return res.end(JSON.stringify(item));
                            } else {
                                res.writeHead(404);
                                return res.end(JSON.stringify({ error: 'Item not found' }));
                            }
                        }
                        res.writeHead(200);
                        return res.end(JSON.stringify(shoppingList)); // Return all items
                    });

                // POST - Add new item to the shopping list
                } else if (req.method === 'POST' && !itemId) {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        let newItem;
                        try {
                            newItem = JSON.parse(body);
                        } catch (parseError) {
                            res.writeHead(400);
                            return res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
                        }
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                res.writeHead(500);
                                return res.end(JSON.stringify({ error: 'Error reading shopping list' }));
                            }
                            let shoppingList;
                            try {
                                shoppingList = JSON.parse(data);
                            } catch (parseError) {
                                res.writeHead(500);
                                return res.end(JSON.stringify({ error: 'Error parsing shopping list data' }));
                            }

                            // Assign an ID to the new item (incremented by 1)
                            newItem.id = shoppingList.length ? Math.max(...shoppingList.map(item => item.id)) + 1 : 1;
                            shoppingList.push(newItem);

                            fs.writeFile(filePath, JSON.stringify(shoppingList, null, 2), 'utf8', (writeErr) => {
                                if (writeErr) {
                                    res.writeHead(500);
                                    return res.end(JSON.stringify({ error: 'Error updating shopping list' }));
                                }
                                res.writeHead(201);
                                return res.end(JSON.stringify(newItem));
                            });
                        });
                    });

                // PUT - Update an item
                } else if (req.method === 'PUT' && itemId) {
                    let body = '';
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    req.on('end', () => {
                        let updateData;
                        try {
                            updateData = JSON.parse(body);
                        } catch (parseError) {
                            res.writeHead(400);
                            return res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
                        }
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                res.writeHead(500);
                                return res.end(JSON.stringify({ error: 'Error reading shopping list' }));
                            }
                            let shoppingList;
                            try {
                                shoppingList = JSON.parse(data);
                            } catch (parseError) {
                                res.writeHead(500);
                                return res.end(JSON.stringify({ error: 'Error parsing shopping list data' }));
                            }
                            const index = shoppingList.findIndex(item => item.id === itemId);
                            if (index !== -1) {
                                // Update the existing item with new data
                                shoppingList[index] = { ...shoppingList[index], ...updateData, id: itemId };
                                fs.writeFile(filePath, JSON.stringify(shoppingList, null, 2), 'utf8', (writeErr) => {
                                    if (writeErr) {
                                        res.writeHead(500);
                                        return res.end(JSON.stringify({ error: 'Error updating shopping list' }));
                                    }
                                    res.writeHead(200);
                                    return res.end(JSON.stringify(shoppingList[index]));
                                });
                            } else {
                                res.writeHead(404);
                                return res.end(JSON.stringify({ error: 'Item not found' }));
                            }
                        });
                    });

                // DELETE - Remove an item by ID
                } else if (req.method === 'DELETE' && itemId) {
                    fs.readFile(filePath, 'utf8', (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ error: 'Error reading shopping list' }));
                        }
                        let shoppingList;
                        try {
                            shoppingList = JSON.parse(data);
                        } catch (parseError) {
                            res.writeHead(500);
                            return res.end(JSON.stringify({ error: 'Error parsing shopping list data' }));
                        }
                        const updatedList = shoppingList.filter(item => item.id !== itemId);

                        // If the item is not found, return 404
                        if (shoppingList.length === updatedList.length) {
                            res.writeHead(404);
                            return res.end(JSON.stringify({ error: 'Item not found' }));
                        }

                        fs.writeFile(filePath, JSON.stringify(updatedList, null, 2), 'utf8', (writeErr) => {
                            if (writeErr) {
                                res.writeHead(500);
                                return res.end(JSON.stringify({ error: 'Error updating shopping list' }));
                            }
                            res.writeHead(204); // No content, indicating success
                            return res.end();
                        });
                    });

                } else {
                    res.writeHead(405); // Method not allowed
                    return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
                }

            } else {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'Endpoint Not Found' }));
            }
        });

        const PORT = 5002;
        server.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    });
});