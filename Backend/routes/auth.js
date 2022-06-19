const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create User using Post
router.post(
  //validation using express-validator
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a valid password").isEmail(),
    body("password", "Enter a valid password").isLength({ min: 7 }),
  ],
  async (req, res) => {
    //If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      //Check if user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exists" });
      }
      //Actual creation of user
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });
      //   .then((user) => res.json(user))
      //   .catch((err) => {
      //     console.log(err);
      //     res.json({
      //       error: "Please enter a unique value for email",
      //       message: err.message,
      //     });
      //   });
      res.json(req.body);
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occurred: " + error.message);
    }
  }
);

module.exports = router;
