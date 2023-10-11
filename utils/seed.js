const connection = require("../config/connection.js");

const { User, Thought, reactionSchema } = require("../models");
const {
  getRandomUsername,
  getRandomEmail,
  getRandomFriends,
  getRandomThoughts,
  getRandomReaction,
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
      `===========================================================`
    );

    // DELETE EXISTING COLLECTIONS FROM THE DATABASE (IF ANY EXIST).
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
        `===========================================================`
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
        `===========================================================`
      );
    }

    // SEED THE USER COLLECTION WITH RANDOM USERS AND EMAILS.
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
      `===========================================================`
    );

    // SEED THE USER COLLECTION WITH RANDOM FRIENDS FROM EXISTING USERS.
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
      `===========================================================`
    );

    // Serialize the array of users data.
    const findUsers = await User.find({});
    const seededUsers = findUsers.map((user) => user.toObject());

    // SEED THE THOUGHT COLLECTION WITH RANDOM THOUGHTS.
    const thoughts = [];

    for (let i = 0; i < 40; i++) {
      const thoughtText = getRandomThoughts();
      const randomUserIndex = Math.floor(Math.random() * seededUsers.length);

      const thought = {
        thoughtText,
        username: seededUsers[randomUserIndex].username, // Include the username for reference
        reactions: [],
      };

      thoughts.push(thought);
    }

    // SEED THE THOUGHT COLLECTION WITH RANDOM REACTIONS.
    const reactions = [];

    // Generate 50 random reactions
    for (let i = 0; i < 50; i++) {
      const reactionBody = getRandomReaction();
      const randomUserIndex = Math.floor(Math.random() * seededUsers.length);

      const reaction = {
        reactionBody,
        username: seededUsers[randomUserIndex].username, // Include the username for reference
      };

      reactions.push(reaction);
    }

    // Add the reactions to the thoughts
    for (let i = 0; i < 50; i++) {
      // Get a random reaction from the reactions array
      const randomReactionIndex = Math.floor(Math.random() * reactions.length);

      //Get a random thought from the thoughts array
      const randomThoughtIndex = Math.floor(Math.random() * thoughts.length);

      const selectedReaction = reactions.splice(randomReactionIndex, 1)[0];

      // Add the random reaction to the thought's reactions array
      thoughts[randomThoughtIndex].reactions.push(selectedReaction);
    }

    // Insert the thoughts into the Thought collection.
    await Thought.collection.insertMany(thoughts);

    // Serialize the array of thoughts data.
    const findThoughts = await Thought.find({});
    const seededThoughts = findThoughts.map((thought) => thought.toObject());

    console.log(
      `\n===========================================================`
    );
    console.log(
      `CREATED "THOUGHT" COLLECTION: SEEDED "${thoughts.length}" "THOUGHTS" AND "50" REACTIONS!`
    );
    console.log(
      `===========================================================`
    );

    // SEED THE USER COLLECTION WITH RANDOM THOUGHT "_id"'S FROM EXISTING THOUGHTS.
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

    // Serialize the array of users data.
    const updatedUsersSecond = await User.find({});
    const seededUsersSecond = updatedUsersSecond.map((user) => user.toObject());

    console.log(
      `\n===========================================================`
    );
    console.log(`UPDATED "USER" COLLECTION: ADDED THOUGHT ID'S TO EACH USER!`);
    console.log(
      `===========================================================`
    );

    console.log(
      `\n===========================================================`
    );
    console.log("SEEDING COMPLETE!");
    console.log(
      `===========================================================`
    );

    // Log samples of the seeded data to the console.
    console.log(
      `\n===========================================================`
    );
    console.log(
      `SAMPLE THOUGHTS:`,
      seededThoughts[0],
      seededThoughts[1],
      seededThoughts[2],
      `\n`
    );
    console.log(
      `SAMPLE USERS:`,
      seededUsersSecond[0],
      seededUsersSecond[1],
      seededUsersSecond[2]
    );
    console.log(
      `===========================================================\n`
    );
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
      `===========================================================`
    );
  }
};

seedDatabase();
