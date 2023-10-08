// Import the Express.js router module.
const router = require("express").Router();

// Import the user and thought routes.
const userRoutes = require("./users");
const thoughtRoutes = require("./thoughts");

// Middleware: Send every request with the /users endpoint to the user routes.
router.use("/users", userRoutes);

// Middleware: Send every request with the /thoughts endpoint to the thought routes.
router.use("/thoughts", thoughtRoutes);

// Export the router instance.
module.exports = router;