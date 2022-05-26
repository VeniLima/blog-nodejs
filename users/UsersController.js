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

router.get("/users/edit/:id", (req, res) => {
  let id = req.params.id;

  User.findByPk(id).then((user) => {
    res.render("admin/users/edit", {
      user: user,
    });
  });
});

router.post("/user/update", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let id = req.body.id;
  let salt = bcrypt.genSaltSync(16);
  let hash = bcrypt.hashSync(password, salt);

  User.update(
    {
      username: username,
      password: hash,
    },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/users");
  });
});

router.post("/users/delete", (req, res) => {
  let id = req.body.id;

  User.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/admin/users");
  });
});

module.exports = router;
