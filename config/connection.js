// Import the 'connect' and 'connection' objects from the 'mongoose' library.
const { connect, connection } = require("mongoose");

// Define a connection string for MongoDB. It checks if the 'MONGODB_URI' environment variable exists (e.g., when deployed on Heroku).
// If the variable exists, it uses that value; otherwise, it defaults to a local MongoDB instance.
const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social-network-db";

// Use the 'connect' function from 'mongoose' to establish a connection to the MongoDB database.
connect(connectionString);

// Export the 'connection' object.
// Note: It allows other parts of the application to interact with the established database connection.
module.exports = connection;
