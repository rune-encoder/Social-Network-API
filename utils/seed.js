const connection = require("../config/connection.js");

const chalk = require('chalk');

const { User, Thought } = require("../models");
const {
  getRandomUsername,
  getRandomEmail,
  getRandomFriends,
  getRandomThoughts,
  getRandomReaction,
} = require("./data.js");

// IMPORT THE HELPER FUNCTIONS
const dropCollectionIfExists = require("./dropCollectionIfExists.js");
const serializeData = require("./serializeData.js");

// SEED THE DATABASE WITH RANDOM DATA
const seedDatabase = async () => {
  try {
    // Wait for the database connection to establish before seeding data.
    await new Promise((resolve) => {
      connection.once("open", resolve);
    });

    console.log(chalk.yellow.bold`\n===========================================================`);
    console.log(chalk.green.bold`DATABASE CONNECTION OPEN\n STATUS: ${connection.readyState}`);
    console.log(chalk.yellow.bold`===========================================================`);

    // DROP EXISTING COLLECTIONS FROM THE DATABASE (IF ANY EXIST).
    await dropCollectionIfExists("users");
    await dropCollectionIfExists("thoughts");

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

    // CREATE THE USER COLLECTION WITH RANDOM USERS AND EMAILS.
    await User.collection.insertMany(users);

    console.log(chalk.bold.green`\n===========================================================`);
    console.log(chalk.bold.green`CREATED ${chalk.bold.magenta`USER`} COLLECTION: SEEDED "${chalk.bold.magenta(users.length)}" USERS!`);
    console.log(chalk.bold.green`===========================================================`);

    // SEED THE USER COLLECTION WITH RANDOM FRIENDS FROM EXISTING USERS.
    for (const user of users) {

      // Generate a random number of friends between 1 and 3
      const friendCount = Math.floor(Math.random() * 3 + 1);

      // Get a random set of friends
      const selectedFriends = getRandomFriends(users, user, friendCount);

      // UPDATE THE USER'S IN USER COLLECTION WITH RANDOM FRIENDS
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: { friends: { $each: selectedFriends } }, // Add each friend to the user's friends array
        },
        { new: true } // Return the updated document
      );
    }

    console.log(chalk.bold.green`\n===========================================================`);
    console.log(chalk.bold.green`UPDATED ${chalk.bold.magenta`"USER"`} COLLECTION: ADDED FRIENDS TO EACH USER`);
    console.log(chalk.bold.green`===========================================================`);

    // Serialize the array of users data.
    const seededUsers = await serializeData(User);

    // GENERATE RANDOM THOUGHTS FOR A USER
    const thoughts = [];

    for (let i = 0; i < 40; i++) {
      const thoughtText = getRandomThoughts();
      const randomUserIndex = Math.floor(Math.random() * seededUsers.length);

      const thought = {
        thoughtText,
        username: seededUsers[randomUserIndex].username, 
        reactions: [],
      };

      thoughts.push(thought);
    }

    // GENERATE RANDOM REACTIONS FOR A THOUGHT (UP TO 50 REACTIONS)
    const reactions = [];

    for (let i = 0; i < 50; i++) {
      const reactionBody = getRandomReaction();
      const randomUserIndex = Math.floor(Math.random() * seededUsers.length);

      const reaction = {
        reactionBody,
        username: seededUsers[randomUserIndex].username, // Include the username for reference
      };

      reactions.push(reaction);
    }

    // PUSH RANDOM REACTIONS (WITH RANDOM USERS) TO RANDOM THOUGHTS
    for (let i = 0; i < 50; i++) {
      // Get a random reaction from the reactions array
      const randomReactionIndex = Math.floor(Math.random() * reactions.length);

      //Get a random thought from the thoughts array
      const randomThoughtIndex = Math.floor(Math.random() * thoughts.length);
      const selectedReaction = reactions.splice(randomReactionIndex, 1)[0];

      // Add the random reaction to the thought's reactions array
      thoughts[randomThoughtIndex].reactions.push(selectedReaction);
    }

    // CREATE THE THOUGHT COLLECTION WITH RANDOM THOUGHTS AND REACTIONS.
    await Thought.collection.insertMany(thoughts);

    // Serialize the array of thoughts data.
    const seededThoughts = await serializeData(Thought);

    console.log(chalk.bold.green`\n===========================================================`);
    console.log(chalk.bold.green`CREATED ${chalk.bold.magenta`"THOUGHT"`} COLLECTION: SEEDED "${chalk.bold.magenta(thoughts.length)}" "THOUGHTS" AND ${chalk.bold.magenta`"50"`} REACTIONS!`);
    console.log(chalk.bold.green`===========================================================`);

    // SEED THE USER COLLECTION WITH RANDOM THOUGHT "_id"'S FROM EXISTING THOUGHTS.
    for (const thought of seededThoughts) {
      const username = thought.username;

      // Find the user by username
      const user = await User.findOne({ username });

      if (user) {
        // UPDATE THE USER'S IN USER COLLECTION WITH THOUGHT ID'S BASED ON USERNAME
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
    const seededUsersSecond = await serializeData(User);

    console.log(chalk.bold.green`\n===========================================================`);
    console.log(chalk.bold.green`UPDATED ${chalk.bold.magenta`"USER"`} COLLECTION: ADDED THOUGHT ID'S TO EACH USER!`);
    console.log(chalk.bold.green`===========================================================`);

    console.log(chalk.bold.green`\n===========================================================`);
    console.log(chalk.bold.green`SEEDING COMPLETE!`);
    console.log(chalk.bold.green`===========================================================`);

    // Log samples of the seeded data to the console.
    console.log(
      chalk.bold.yellow`\n===========================================================`
    );
    console.log(
      chalk.black.bgYellow`SAMPLE THOUGHT:`,
      seededThoughts[0],
      `\n`
    );
    console.log(
      chalk.black.bgYellow`SAMPLE USER:`,
      seededUsersSecond[0],
    );
    console.log(
      chalk.bold.yellow`===========================================================\n`
    );
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the database connection
    connection.close();

    // Log that the connection is closed.
    console.log(chalk.yellow.bold`===========================================================`);
    console.log(chalk.red.bold`DATABASE CONNECTION CLOSED\n STATUS: ${connection.readyState}`);
    console.log(chalk.yellow.bold`===========================================================`);
  }
};

seedDatabase();
