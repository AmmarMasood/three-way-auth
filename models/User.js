const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ["jwt", "google", "facebook"],
    required: true
  },
  jwt: {
    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    email: {
      type: String,
      lowercase: true
    },
    id: {
      type: String
    },
    name: {
      type: String
    }
  },
  facebook: {
    email: {
      type: String,
      lowercase: true
    },
    id: {
      type: String
    },
    name: {
      type: String
    }
  }
});
mongoose.model("users", UserSchema);
