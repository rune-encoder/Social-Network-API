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
      `\n================ Database connection open. ================\n Status: ${connection.readyState}`
    );

    // Delete existing collections if they exist.
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (userCheck.length) {
      await connection.dropCollection("users");
      console.log(
        "\n================ Dropped USER collection ================"
      );
    }

    let thoughtCheck = await connection.db
      .listCollections({ name: "thoughts" })
      .toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection("thoughts");
      console.log(
        "\n================ Dropped THOUGHT collection ================\n"
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

    // Serialize the array of users data.
    const findUsers = await User.find({});
    const seededUsers = findUsers.map((user) => user.toObject());

    console.log(
      `\n================ Seeded ${seededUsers.length} Users to the User Collection! ================`
    );
    console.log(
      `================ Seeded the User's Friends to the User collection ================\n`
    );

    // Todo Perform your seeding operations here ==========================

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

    const findThoughts = await Thought.find({});
    const seededThoughts = findThoughts.map((thought) => thought.toObject());
    console.log(seededThoughts);


    // console.log(thoughts);
    // console.log(
    //   `\n================ Seeded ${thoughts.length} Thoughts to the Thought Collection! ================\n`
    // );

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

    const updatedUsers2 = await User.find({});
    const seededUsers2 = updatedUsers2.map((user) => user.toObject());
    console.log(seededUsers2);

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
