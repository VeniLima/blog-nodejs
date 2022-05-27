const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify");
const logged = require("../middlewares/adminAuth");

router.get("/admin/categories/new", logged, (req, res) => {
  let user = req.session.user;
  res.render("admin/categories/new", {
    name: user.username,
  });
});

router.post("/categories/save", (req, res) => {
  let title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/");
  }
});

router.get("/admin/categories", logged, (req, res) => {
  let user = req.session.user;
  Category.findAll({ raw: true, order: [["id", "ASC"]] }).then((categories) => {
    res.render("admin/categories/index", {
      categories: categories,
      name: user.username,
    });
  });
});

router.post("/categories/delete", (req, res) => {
  let id = req.body.id;

  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id,
        },
      }).then(() => {
        res.redirect("/admin/categories");
      });
    } else {
      res.redirect("/admin/categories");
    }
  } else {
    res.redirect("/admin/categories");
  }
});

router.get("/admin/categories/edit/:id", logged, (req, res) => {
  let user = req.session.user;
  let id = req.params.id;
  Category.findByPk(id)
    .then((category) => {
      if (category != undefined) {
        res.render("admin/categories/edit", {
          category: category,
          name: user.username,
        });
      } else {
        res.redirect("/admin/categories");
      }
    })
    .catch((err) => {
      res.redirect("/admin/categories");
    });
});

router.post("/categories/update", (req, res) => {
  let id = req.body.id;
  let title = req.body.title;
  Category.update(
    { title: title, slug: slugify(title) },
    {
      where: {
        id: id,
      },
    }
  ).then(() => {
    res.redirect("/admin/categories");
  });
});

module.exports = router;
