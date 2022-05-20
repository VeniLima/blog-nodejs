const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const articlesController = require('./articles/ArticlesController');
const categoriesController = require("./categories/CategoriesController");
const Category = require('./categories/Category');
const Article = require('./articles/Article');

//Database
connection.authenticate().then(() => {
    console.log("Conexão ao banco de dados bem sucedida");
}).catch((err) => {
    console.log("Ocorreu um erro ao tentar se conectar ao banco de dados");
});


//View Engine
app.set('view engine', 'ejs');

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static
app.use(express.static('public'));

//Rotas

//routes express
app.use("/", categoriesController);
app.use("/", articlesController);
app.get('/', (req, res) => {
    Article.findAll({order: [
        ['id', 'DESC']
    ]}).then((articles) => {
        Category.findAll().then((category)=> {
            res.render('home', {
                articles: articles,
                category: category
            });
        })
        
    })
    
});

app.listen( 4000, () => {
    console.log("Servidor está rodando");
});
