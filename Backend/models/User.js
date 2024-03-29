const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  email: { type: "string", required: true, unique: true }, //descrive unique to ensure uniqueness
  password: { type: "string", required: true },
  date: { type: "date", default: Date.now },
});

const User = mongoose.model("user", UserSchema);
// User.createIndexes();
module.exports = User;
