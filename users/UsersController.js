const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/admin/users/save", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let salt = bcrypt.genSaltSync(16);
  let hash = bcrypt.hashSync(password, salt);
  User.findOne({
    where: {
      username: username,
    },
  }).then((exists) => {
    if (exists) {
      res.redirect("/admin/users/create");
    } else {
      User.create({
        username: username,
        password: hash,
      })
        .then(() => {
          res.redirect("/admin/users");
        })
        .catch((err) => {
          res.send("Ocorreu um erro!");
        });
    }
  });
});

router.get("/admin/users", (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", {
      users: users,
    });
  });
});

module.exports = router;
