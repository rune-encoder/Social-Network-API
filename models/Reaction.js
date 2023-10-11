const { Schema, Types, model } = require("mongoose");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Types.ObjectId,
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
      get: (value) =>
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString(),
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
