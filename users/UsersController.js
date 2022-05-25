const express = require("express");
const router = express.Router();
const User = require("./User");

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/admin/users/save", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.create({
    username: username,
    password: password,
  }).then(() => {
    res.redirect("/admin/users");
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
