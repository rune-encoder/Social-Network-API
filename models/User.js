const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true, // unique username
      required: true, // required field
      trim: true, // removes whitespace
    },
    email: {
      type: String,
      unique: true, // unique email
      required: true, // required field

      // Todo Validation for email ====
      //   match: [],

    },
    thoughts: [
      {
        type: Schema.Types.Object,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.Object,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.__v;
      },
    },
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
