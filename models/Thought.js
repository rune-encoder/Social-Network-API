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

      // Todo Use a getter method to format the timestamp on query
      get: (value) => new Date(value).toLocaleDateString(),
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
    },

    // Todo =========================
    // toObject: { virtuals: true },
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
