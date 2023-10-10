const connection = require("../config/connection.js");

const { User, Thought } = require("../models");
const {
  getRandomUsername,
  getRandomEmail,
  getRandomFriends,
  getRandomThoughts,
} = require("./data.js");

const seedDatabase = async () => {
  try {
    // Connect to the MongoDB database using the Mongoose connection object.
    await new Promise((resolve) => {
      connection.once("open", resolve);
    });

    // Log that the connection was successful.
    console.log(
      `\n===========================================================`
    );
    console.log(`DATABASE CONNECTION OPEN\n STATUS: ${connection.readyState}`);
    console.log(
      `===========================================================\n`
    );

    // Delete existing collections if they exist.
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (userCheck.length) {
      await connection.dropCollection("users");
      console.log(
        `\n===========================================================`
      );
      console.log(`DROPPED COLLECTION: "USERS"`);
      console.log(
        `===========================================================\n`
      );
    }

    let thoughtCheck = await connection.db
      .listCollections({ name: "thoughts" })
      .toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection("thoughts");
      console.log(
        `\n===========================================================`
      );
      console.log(`DROP COLLECTION: "THOUGHTS"`);
      console.log(
        `===========================================================\n`
      );
    }

    // Seed the User collection with random users and emails.
    const users = [];

    for (let i = 0; i < 30; i++) {
      const username = getRandomUsername();
      const email = getRandomEmail(username);

      const user = {
        username,
        email,
      };

      users.push(user);
    }

    // Insert the users into the User collection.
    await User.collection.insertMany(users);
    console.log(
      `\n===========================================================`
    );
    console.log(`CREATED "USER" COLLECTION: SEEDED "${users.length}" USERS!`);
    console.log(
      `===========================================================\n`
    );
    // Populate the friends array for each user.
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

    console.log(
      `\n===========================================================`
    );
    console.log(`UPDATED "USER" COLLECTION: ADDED FRIENDS TO EACH USER`);
    console.log(
      `===========================================================\n`
    );

    // Serialize the array of users data.
    const findUsers = await User.find({});
    const seededUsers = findUsers.map((user) => user.toObject());

    // Seed the Thought collection with random thoughts.
    const thoughts = [];

    for (let i = 0; i < 40; i++) {
      const thoughtText = getRandomThoughts();
      const randomUserIndex = Math.floor(Math.random() * seededUsers.length);

      const thought = {
        thoughtText,
        username: seededUsers[randomUserIndex].username, // Include the username for reference
      };

      thoughts.push(thought);
    }

    // Insert the thoughts into the Thought collection.
    await Thought.collection.insertMany(thoughts);

    // Serialize the array of thoughts data.
    const findThoughts = await Thought.find({});
    const seededThoughts = findThoughts.map((thought) => thought.toObject());

    // TODO =====================================================
    // console.log(seededThoughts);

    console.log(
      `\n===========================================================`
    );
    console.log(
      `CREATED "THOUGHT" COLLECTION: SEEDED "${thoughts.length}" "THOUGHTS"!`
    );
    console.log(
      `===========================================================\n`
    );

    for (const thought of seededThoughts) {
      const username = thought.username;

      // Find the user by username
      const user = await User.findOne({ username });

      if (user) {
        // Update the user's thoughts array with the thought ID
        await User.findByIdAndUpdate(
          user._id,
          {
            $push: { thoughts: thought._id },
          },
          { new: true }
        );
      }
    }

    // TODO =====================================================
    const updatedUsers2 = await User.find({});
    const seededUsers2 = updatedUsers2.map((user) => user.toObject());
    // console.log(seededUsers2);

    console.log(
      `\n===========================================================`
    );
    console.log(`UPDATED "USER" COLLECTION: ADDED THOUGHT ID'S TO EACH USER!`);
    console.log(
      `===========================================================\n`
    );

    console.log(
      `\n===========================================================`
    );
    console.log("SEEDING COMPLETE!");
    console.log(
      `===========================================================\n`
    );

    // TODO =====================================================
    console.log(seededThoughts);
    console.log(seededUsers2);
    
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the database connection
    connection.close();
    // Log that the connection is closed.
    console.log(
      `\n===========================================================`
    );
    console.log(
      `DATABASE CONNECTION CLOSED\n STATUS: ${connection.readyState}`
    );
    console.log(
      `===========================================================\n`
    );
  }
};

seedDatabase();
