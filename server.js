const jsonServer = require('json-server');

// Create a server instance
const server = jsonServer.create();

// Set up the router to handle your db.json file
const router = jsonServer.router('db.json');

// Set default middlewares (logging, CORS, etc.)
const middlewares = jsonServer.defaults();

// Use the middlewares on the server
server.use(middlewares);

// Use the router to handle requests
server.use(router);

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Start the server and listen on the specified port
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
