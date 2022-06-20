const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_Secret = "Rajarshiisagoodboy";

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
      const salt = await bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Actual creation of user
      user = await User.create({
        name: req.body.name,
        password: secPass,
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
      const data = {
        user: { id: user.id },
      };
      const authtoken = jwt.sign(data, JWT_Secret);

      res.json({ authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occurred: " + error.message);
    }
  }
);

module.exports = router;
