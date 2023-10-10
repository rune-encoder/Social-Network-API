// Import the Express.js router module.
const router = require("express").Router();

// Import the thought and reaction controller methods.
const {
  getAllThoughts,
  getSingleThought,
  createThought,
  updateThought,
  removeThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thought-controller");

// GET and POST endpoint at /api/thoughts
router.route("/").get(getAllThoughts).post(createThought);

// GET, UPDATE, DELETE endpoint at /api/thoughts/:id
router
  .route("/:id")
  .get(getSingleThought)
  .put(updateThought)
  .delete(removeThought);

// POST and DELETE endpoint at /api/thoughts/:thoughtId/reactions
router.route("/:thoughtId/reactions").post(addReaction).delete(removeReaction);

// Export the router instance.
module.exports = router;
