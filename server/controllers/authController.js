const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) {
          console.error(err);
          res.status(500).json("Internal server error");
        } else {
          res.cookie("token", token, { sameSite: "None", secure: true }).json({
            id: userDoc._id,
            username,
          });
        }
      });
    } else {
      res.status(400).json("Wrong password");
    }
  } else {
    res.status(400).json("User not found");
  }
};

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.logout = (req, res) => {
  res
    .cookie("token", "", {
      sameSite: "None",
      secure: true,
      expires: new Date(0),
    })
    .json("ok");
};
