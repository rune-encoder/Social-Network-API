const { User, Thought } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const userData = await User.find({});
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const userData = await User.findOne({ _id: req.params.userId })
        .populate("friends")
        .populate("thoughts");

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
      const userData = await User.create(req.body);
      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const userData = await User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.userId });

      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      await Thought.deleteMany({ _id: { $in: userData.thoughts } });

      res.status(200).json({
        message: `User "${userData.username}" deleted. All thoughts associated with this user have been deleted as well.`,
        deletedUser: userData,
      });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      const userData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!userData) {
        return res.status(404).json({ message: `No user found with that ID` });
      }

      res.status(200).json(userData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
