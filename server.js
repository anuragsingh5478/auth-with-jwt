const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//Import Routes
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");

dotenv.config();

const PORT = 5000;

//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("DB connected")
);
//Middleware
app.use(express.json());

//Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(PORT, () => console.log(`server started at port: ${PORT}`));
