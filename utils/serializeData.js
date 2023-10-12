// HELPER FUNCTION TO SERIALIZE DATA (FROM MONGOOSE OBJECTS TO PLAIN OBJECTS)
const serializeData = async (model) => {
  try {
    // Serialize the array of data.
    const data = await model.find({});

    // Return the serialized data.
    return data.map((item) => item.toObject());
  } catch (error) {
    // If an error occurs, log the error to the console.
    console.error(`Error serializing data:`, error);
  }
};

module.exports = serializeData;