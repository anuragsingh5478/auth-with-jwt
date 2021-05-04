const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");

module.exports.registerUser = async (req, res) => {
  // Validation
  const { error, value } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if User's Email Already in the Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("email already in use");

  //Hash the password
  const saltRound = 10;
  const hashedPassword = await bcrypt.hash(req.body.password, saltRound);

  // Creating new User
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports.loginUser = async (req, res) => {
  // Validation
  const { error, value } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if User's Email Already in the Database
  const user = await User.findOne({ email: req.body.email }).catch((err) =>
    res.status(400).send(err)
  );
  if (!user) return res.status(400).send("email does not exist");

  // Check if Password is Correct
  const validPass = await bcrypt
    .compare(req.body.password, user.password)
    .catch((err) => res.status(400).send(err));
  if (!validPass)
    return res.status(400).send("email and password does not match");

  // Create and Assign a Token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
};
