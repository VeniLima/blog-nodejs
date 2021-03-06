const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");
const Category = require("../categories/Category");
const req = require("express/lib/request");
const logged = require("../middlewares/adminAuth");
const Article = require("../articles/Article");

router.get("/admin/users/create", (req, res) => {
  let user = req.session.user;
  res.render("admin/users/create", {
    name: user.username,
  });
});

router.post("/admin/users/save", logged, (req, res) => {
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

router.get("/admin/users", logged, (req, res) => {
  let user = req.session.user;
  User.findAll().then((users) => {
    res.render("admin/users/index", {
      users: users,
      name: user.username,
    });
  });
});

router.get("/users/edit/:id", logged, (req, res) => {
  let user = req.session.user;
  let id = req.params.id;

  User.findByPk(id).then((users) => {
    res.render("admin/users/edit", {
      users: users,
      name: user.username,
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

router.get("/login", (req, res) => {
  let name = req.session.username;
  Category.findAll().then((categories) => {
    res.render("admin/users/login", {
      categories: categories,
      name: name,
    });
  });
});

router.post("/authenticate", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({
    where: {
      username: username,
    },
  }).then((user) => {
    if (user != undefined) {
      let passwordVerify = bcrypt.compareSync(password, user.password);
      if (passwordVerify) {
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;

  res.redirect("/");
});

module.exports = router;
