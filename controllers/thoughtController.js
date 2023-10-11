const { Thought, User } = require("../models");

module.exports = {
  async getAllThoughts(req, res) {
    try {
      // GET: all thoughts
      const thoughtData = await Thought.find({});
      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      // GET: the thought with the matching ID
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });

      // If no thought is found, return a 404 error
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: `No thought found with that ID` });
      }

      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      // CREATE: the new thought
      const thoughtData = await Thought.create(req.body);

      // UPDATE: Find the user with the matching username and update their thoughts array
      const userData = await User.findOneAndUpdate(
        { username: req.body.username },
        { $push: { thoughts: thoughtData._id } },
        { new: true }
      );

      // If no user is found with the matching username, return a 404 error
      if (!userData) {
        return res
          .status(404)
          .json({ message: `No user found with that username!` });
      }

      res.status(200).json(thoughtData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      // UPDATE: the thought with the matching ID
      const thoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      // If no thought is found, return a 404 error
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: `No thought found with that ID` });
      }

      // Confirm that the thought was updated successfully
      res.status(200).json({
        message: `Thought updated successfully!`,
        updatedThought: thoughtData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeThought(req, res) {
    try {
      // DELETE: the thought with the matching ID
      const thoughtData = await Thought.findOneAndDelete(
        { _id: req.params.thoughtId },
        { runValidators: true, new: true }
      );

      // If no thought is found, return a 404 error
      if (!thoughtData) {
        return res
          .status(404)
          .json({ message: `No thought found with that ID` });
      }

      // UPDATE: Find the user with the matching username and update their thoughts array
      const userData = await User.findOneAndUpdate(
        { username: thoughtData.username },
        { $pull: { thoughts: thoughtData._id } },
        { new: true }
      );

      // If no user is found with the matching username, return a 404 error
      if (!userData) {
        return res.status(404).json({
          message: `Unable to find the user associated with the thought`,
        });
      }

      // Confirm deletion of selected thought and update user's thoughts array
      res.status(200).json({
        message: `Thought deleted successfully! User ${userData.username}'s thoughts array has been updated.`,
        deletedThought: thoughtData,
        updatedUser: userData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      // CREATE: the new reaction
      // UPDATE: the thought with the matching ID with the new reaction
      const reactionData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      // If no thought is found, return a 404 error
      if (!reactionData) {
        return res
          .status(404)
          .json({ message: `No thought found with that ID` });
      }

      // Confirm that the reaction was added successfully
      res.status(200).json({
        message: `Reaction added successfully!`,
        updatedThought: reactionData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      // DELETE: the reaction with the matching ID
      // UPDATE: the thought with the matching ID with removing the reaction
      const reactionData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      // If no thought or reaction is found, return a 404 error
      if (!reactionData) {
        return res.status(404).json({
          message: `No thought or reaction found using the selected ID.`,
        });
      }

      // Confirm deletion of selected reaction
      res.status(200).json({
        message: `Reaction deleted successfully!`,
        updatedThought: reactionData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
