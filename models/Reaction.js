const { Schema, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,

      // Todo Use a getter method to format the timestamp on query
      get: (value) => new Date(value).toLocaleDateString(),
    },
  },
  {
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.__v;
      },
    },
  }
);

module.exports = reactionSchema;
