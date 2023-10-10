const connection = require("../config/connection.js");

const { User, Thought } = require("../models");
const usernamesAndEmails = require("./data.js");

const seedDatabase = async () => {
  try {
    // Connect to the MongoDB database using the Mongoose connection object.
    await new Promise((resolve) => {
      connection.once("open", resolve);
    });

    // Confirm that the connection was successful.
    console.log(connection.readyState);
    console.log("Database connection successful.");

    // Delete existing collections if they exist.
    let userCheck = await connection.db
      .listCollections({ name: "users" })
      .toArray();
    if (userCheck.length) {
      await connection.dropCollection("users");
      console.log("Dropped users collection");
    }

    let thoughtCheck = await connection.db
      .listCollections({ name: "thoughts" })
      .toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection("thoughts");
      console.log("Dropped thoughts collection");
    }

    // Todo Perform your seeding operations here
    await User.collection.insertMany(usernamesAndEmails);


    
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close the database connection
    connection.close();

    // Confirm that the connection is closed
    console.log(connection.readyState);
    console.log("Database connection closed.");
  }
};

seedDatabase();

