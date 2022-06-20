const express = require("express");
const router = express.Router();
var fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//fetch notes
router.get("/fetchnotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

//Add notes
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 2 }),
    body("description", "Enter a valid desc").isLength({ min: 7 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const notes = await Notes.find({ user: req.user.id });
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);
//delete notes
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id); //find note by id Model.findById
    if (!note) {
      return res.status(404).send("No note found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json("Note Deleted");
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;
