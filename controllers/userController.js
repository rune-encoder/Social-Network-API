const { User } = require("../models");

module.exports = {
    async getAllUsers(req, res) {
        const users = await User.find({})
    }
};
