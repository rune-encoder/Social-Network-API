// Import the Express.js router module.
const router = require("express").Router();

// Import the user controller methods.
const {
  getAllUsers,
  getSingleUser,
  createNewUser,
  updateUser,
  removeUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController.js");

// GET and POST endpoint at /api/users
router.route("/").get(getAllUsers).post(createNewUser);

// GET, UPDATE, DELETE endpoint at /api/users/:userId
router.route("/:userId").get(getSingleUser).put(updateUser).delete(removeUser);

// POST and DELETE endpoint at /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

// Export the router instance.
module.exports = router;
