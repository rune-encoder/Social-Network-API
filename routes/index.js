// Import the Express.js router module.
const router = require("express").Router();

// Import the API routes.
const apiRoutes = require("./api");

// Middleware: Send every request with the /api endpoint to the API routes.
router.use("/api", apiRoutes);

// Middleware: handle errors that may occur in previous middleware or route handlers.
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Code is Broken!");
});

// Middleware: catch-all route handler for routes that don't match any of the defined routes.
// Sends a 404 Not Found response with a message "Route not found!".
router.use((req, res) => {
  res.status(404).send("Route not found!");
});

// Export the router instance.
module.exports = router;
