const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  title: {
    type: "string",
    required: true,
  },
  description: { type: "string", required: true },
  tags: { type: "string" },
  date: { type: "date", default: Date.now },
});

module.exports = mongoose.model("notes", NotesSchema);
