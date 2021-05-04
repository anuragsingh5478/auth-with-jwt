const express = require("express");
const router = express.Router();

// const authController = require("../controllers/authController");
const verifyRoute = require("../routes/verifyRoute");

router.get("/", verifyRoute, (req, res) => {
  res.send("private post, user_id: " + req.user._id);
});

module.exports = router;
