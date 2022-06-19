const mongoose = require("mongoose");

const NotesSchema = new Schema({
  name: {
    type: "string",
    required: true,
  },
  description: { type: "string", required: true },
  tags: { type: "string" },
  date: { type: "date", default: Date.now },
});

module.exports = mongoose.model("notes", NotesSchema);
