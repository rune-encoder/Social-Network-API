const { Schema, model } = require("mongoose");

const reactionSchema = require("./Reaction.js");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1, // 1 character minimum
      maxlength: 280, // 280 character limit
    },
    createdAt: {
      type: Date, // Date data type
      default: Date.now, // Current timestamp
      get: (value) =>
        new Date(value).toLocaleDateString() +
        " " +
        new Date(value).toLocaleTimeString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.__v;
      },
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
