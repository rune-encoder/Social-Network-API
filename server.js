// Import the Express.js library, which is used to create the web server.
const express = require("express");

// Import the database connection module.
const db = require("./config/connection.js");

// Import the routes module, which contains the application's routing logic.
const routes = require("./routes");

// Define the port on which the server will listen. If an environment variable
// PORT is provided, it will use that; otherwise, it defaults to 3001.
const PORT = process.env.PORT || 3001;

// Create an instance of the Express application, representing the web server.
const app = express();

// Middleware: Parse incoming URL-encoded data and populate req.body with the parsed data.
app.use(express.urlencoded({ extended: true }));

// Middleware: Parse incoming JSON data and populate req.body with the parsed JSON.
app.use(express.json());

// Middleware: Use the routing logic defined in the "routes" module to handle incoming requests.
// app.use(routes);

// Database Connection Event Listener: Listen for the "open" event of the database connection.
db.once("open", () => {
  // When the database connection is successfully opened, start the Express server.
  app.listen(PORT, () => {
    // Log a message to the console indicating that the API server is running on the specified port.
    console.log(`API server running on port ${PORT}!`);
  });
});
