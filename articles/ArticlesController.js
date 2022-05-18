const express = require("express");
const router = express.Router();
const Article = require('./Article');
const Category = require('../categories/Category');
const slugify = require('slugify');
const res = require("express/lib/response");

router.get("/admin/articles/new", (req, res) => {
    
    Category.findAll().then((categories) => {
        res.render('admin/articles/new', {
            categories: categories
        });
    })  
});

router.post("/articles/save", (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles')
    })
});

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then((article) => {
        res.render('admin/articles/index', {
            article: article
        });
    })
});

router.post('/articles/delete', (req, res) => {
    let id = req.body.id;

    Article.destroy({where: {
        id: id
    }}).then(() => {
        res.redirect('/admin/articles')
    });
});

router.get('/admin/articles/edit/:id', (req, res) => {
    let id = req.params.id;
    Article.findByPk(id).then((article) => {
        Category.findAll().then((category) => {
            res.render('admin/articles/edit', {
                article: article,
                category: category
        })
        });
    })
    
   
     
});

router.post('/articles/update', (req, res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    let id = req.body.id;

    Article.update({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }, {
        where: {
        id: id
    }}).then(() => {
        res.redirect('/admin/articles');
    })
})


module.exports = router;