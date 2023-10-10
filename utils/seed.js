const connection = require("../config/connection.js");

const { User, Thought } = require("../models");
const {
  getRandomUsername,
  getRandomEmail,
  getRandomFriends,
} = require("./data.js");

const seedDatabase = async () => {
  try {

    // Connect to the MongoDB database using the Mongoose connection object.
    await new Promise((resolve) => {
      connection.once("open", resolve);
    });

    // Log that the connection was successful.
    console.log(
      `\n================ Database connection open. ================\n Status: ${connection.readyState}`
    );

    // Delete existing collections if they exist.
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (userCheck.length) {
      await connection.dropCollection("users");
      console.log("\n================ Dropped USER collection ================");
    }

    let thoughtCheck = await connection.db
      .listCollections({ name: "thoughts" })
      .toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection("thoughts");
      console.log("\n================ Dropped THOUGHT collection ================\n");
    }

    // Seed users and their friends
    const users = [];

    for (let i = 0; i < 30; i++) {
      const username = getRandomUsername();
      const email = getRandomEmail(username);

      const user = {
        username,
        email,
        friends: [],
      };

      users.push(user);
    }

    await User.collection.insertMany(users);

    // Seed friends for each user
    for (const user of users) {

      // Generate a random number of friends between 1 and 3
      const friendCount = Math.floor(Math.random() * 3 + 1);

      // Get a random set of friends
      const selectedFriends = getRandomFriends(users, user, friendCount);

      // Update the user's friends array
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: { friends: { $each: selectedFriends } }, // Add each friend to the user's friends array
        },
        { new: true } // Return the updated document
      );
    }

    // Log serialized users with friends array populated.
    const userTable = await User.find({});
    const seededUsers = userTable.map((user) => user.toObject());
    console.log(seededUsers);
    console.log(`\n================ Seeded ${seededUsers.length} Users! ================`);
    console.log(`================ Seeded the User's Friends! ================\n`);

    // Todo Perform your seeding operations here ==========================

    console.log("\n================ Seeding completed! ================");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {

    // Close the database connection
    connection.close();
    // Log that the connection is closed.
    console.log(
      `\n================ Database connection closed! ================\n Status: ${connection.readyState}`
    );
  }
};

seedDatabase();
