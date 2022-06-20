const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_Secret = "Rajarshiisagoodboy"; //JWT token

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

//Authentication of the user for login
router.post(
  //validation using express-validator
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank").exists({ min: 7 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "enter correct creds" });
      }

      const payload = {
        user: { id: user.id },
      };
      const authtoken = jwt.sign(payload, JWT_Secret);
      res.json(authtoken);
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occurred: " + error.message);
    }
  }
);

module.exports = router;
