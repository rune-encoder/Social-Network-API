const connection = require("../config/connection.js");

const chalk = require("chalk");

// HELPER FUNCTION TO DROP A COLLECTION FROM THE DATABASE (IF IT EXISTS)
const dropCollectionIfExists = async (collectionName) => {
  try {
    // Check if the collection exists in the database.
    const collectionCheck = await connection.db
      .listCollections({ name: collectionName })
      .toArray();

    // If the collection exists, drop it from the database.
    if (collectionCheck.length) {
      await connection.dropCollection(collectionName);

      // Log the dropped collection to the console.
      console.log(
        chalk.bold
          .red`\n===========================================================`
      );
      console.log(
        chalk.bold.red`DROPPED COLLECTION: "${collectionName.toUpperCase()}"`
      );
      console.log(
        chalk.bold
          .red`===========================================================`
      );
    }
  } catch (error) {
    // If an error occurs, log the error to the console.
    console.error(`Error dropping collection ${collectionName}:`, error);
  }
};

module.exports = dropCollectionIfExists;
