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

        if(title && body && category != undefined){
            Article.create({
                title: title,
                slug: slugify(title),
                body: body,
                categoryId: category
            }).then(()=>{
                res.redirect('/admin/articles')
            })

        }else{
            res.redirect("/admin/articles")
        }
    
});

router.get('/admin/articles', (req, res) => {
    Article.findAll({
        include: [{
            model: Category
        }], 
        order: [['id', 'DESC']]
    }).then((article) => {
        if(article.categoryId == null){
            Article.destroy({where: {categoryId: null}})
        }
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
});

router.get('/articles/:slug', (req, res) => {
    let slug = req.params.slug;
    Article.findOne({where:{slug: slug}}).then((article) => {
        Category.findAll().then(categories => {
            res.render('user/articles/read', {
                article: article,
                categories: categories
            })
        })
       
    })
});

router.get('/articles/category/:slug', (req, res) => {
    let slug = req.params.slug;
    
    Category.findOne({where: {
        slug: slug
    }, include: [{model: Article}]
}).then(category => {
    Category.findAll().then(categories => {
        res.render('user/articles/byCategory', {
            articles: category.articles,
            category: category,
            categories: categories
        })
    })
})
})


module.exports = router;