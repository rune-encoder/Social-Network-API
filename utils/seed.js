const connection = require("../config/connection.js");

const { User, Thought } = require("../models");

const seedDatabase = async () => {
  try {
    // Attempt to connect to the database
    await connection;

    console.log('Database connection successful.');

    // Todo Perform your seeding operations here

  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    // Close the database connection
    console.log('Database connection closed.');
    connection.close();
  }
};

seedDatabase();

    // // Delete existing collections if they exist
    // await Student.collection.drop();
    // await Course.collection.drop();

    // // Create empty array to hold the students
    // const students = [];

    // // Loop 20 times to add students to the students array
    // for (let i = 0; i < 20; i++) {
    //   const assignments = getRandomAssignments(20);
    //   const fullName = getRandomName();
    //   const [first, last] = fullName.split(' ');
    //   const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

    //   students.push({
    //     first,
    //     last,
    //     github,
    //     assignments,
    //   });
    // }

    // // Add students to the collection
    // await Student.insertMany(students);

    // // Add courses to the collection
    // await Course.create({
    //   courseName: 'UCLA',
    //   inPerson: false,
    //   students,
    // });

    // // Log out the seed data to indicate what should appear in the database
    // console.table(students);
    // console.info('Seeding complete! 🌱');
