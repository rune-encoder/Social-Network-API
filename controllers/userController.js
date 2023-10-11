const { User, Thought } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      // GET: all users
      const userData = await User.find({});
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      // GET: the user with the matching ID
      const userData = await User.findOne({ _id: req.params.userId })
        .populate("friends")
        .populate("thoughts");

      // If no user is found, return a 404 error
      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createNewUser(req, res) {
    try {
      // CREATE: the new user
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      // UPDATE: the user with the matching ID
      const userData = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
      );

      // If no user is found, return a 404 error
      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      // Confirm that the user was updated successfully
      res
        .status(200)
        .json({ message: `User updated successfully!`, updatedUser: userData });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeUser(req, res) {
    try {
      // DELETE: the user with the matching ID
      const userData = await User.findOneAndDelete({ _id: req.params.userId });

      // If no user is found, return a 404 error
      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      // DELETE: all thoughts associated with the deleted user
      const thoughtData = await Thought.deleteMany({
        _id: { $in: userData.thoughts },
      });

      // Confirm that the user and their thoughts were deleted successfully
      res.status(200).json({
        message: `User ${userData.username} deleted. All thoughts associated with this user have been deleted as well.`,
        deltedUser: {
          username: userData.username,
          email: userData.email,
          thoughts: userData.thoughts,
        },
        deletedThoughts: thoughtData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      // ADD: the friend with the matching ID to the user's friends array
      // UPDATE: the user with the matching ID to include the new friend
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      // If no user is found, return a 404 error
      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      // Confirm that the friend was added successfully
      res
        .status(200)
        .json({ message: `Friend added successfully!`, updatedUser: userData });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      // DELETE: the friend with the matching ID from the user's friends array
      // UPDATE: the user with the matching ID to remove the friend from their friends array
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      // If no user is found, return a 404 error
      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      // Confirm that the friend was removed successfully
      res.status(200).json({
        message: `Friend removed successfully!`,
        updatedUser: userData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
