const express = require("express");
require("./models/User.js");
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to mongodb"))
  .catch(err => console.log(err));

//passport
app.use(cors());
app.use(passport.initialize());
require("./config/passport")(passport);

require("./routes/user")(app);

app.listen(5000, () => console.log("Server is running on port 5000"));
