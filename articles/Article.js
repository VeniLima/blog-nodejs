const Sequelize = require('sequelize');
const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Um para muitos
Category.hasMany(Article);

// Um para Um
Article.belongsTo(Category);

//Recriar a tabela --> excluir apos isso
//Article.sync({force: true});

module.exports = Article;