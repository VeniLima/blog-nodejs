const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const articlesController = require("./articles/ArticlesController");
const categoriesController = require("./categories/CategoriesController");
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const usersController = require("./users/UsersController");
const session = require("express-session");
const logged = require("./middlewares/adminAuth");

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão ao banco de dados bem sucedida");
  })
  .catch((err) => {
    console.log("Ocorreu um erro ao tentar se conectar ao banco de dados");
  });

//View Engine
app.set("view engine", "ejs");

//session
app.use(
  session({
    secret: "Ox9Di5grYG0F8RRUTBrJqpr0FmHV4ZjR",
    cookie: {
      maxAge: 3600000,
    },
  })
);

//BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static
app.use(express.static("public"));

//routes express
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Rotas
app.get("/", (req, res) => {
  Article.findAll({ order: [["id", "DESC"]], limit: 4 }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("home", {
        articles: articles,
        categories: categories,
      });
    });
  });
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Servidor está rodando");
});
