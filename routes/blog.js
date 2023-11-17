const express = require('express');
const db = require('../data/database');

const router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/posts');
});

router.get('/posts', async function(req, res) {
    const query = `
    SELECT posts.*, authors.name AS author_name FROM blog.posts
     INNER JOIN authors ON posts.author_id = authors.id
    `;
    const [posts] = await db.query(query);
    res.render('posts-list', {posts: posts});
});

router.get('/new-post', async function(req, res) {
    const [authors] = await db.query('SELECT * FROM authors');   //async finishing this first , getting the first array and putting it in authors
    res.render('create-post', {authors: authors});
});

router.post('/posts', async function (req, res){
    const data = [
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author,
    ];
    await db.query('INSERT INTO posts(title, summary, body, author_id) VALUES (?)', [data,]);
    
    res.redirect('/posts');
});

router.get('/posts/:id', async function(req,res){
    const query = `
        SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
        INNER JOIN authors ON posts.author_id = authors.id
        WHERE posts.id = ?
    `;
    const [posts] = await db.query(query, [req.params.id]);

    if (!posts || posts.length === 0){
        return res.status(404).render('404');    //return to stop next lines from executing
    }

    const postData = {
        ...posts[0],
        date: posts[0].date.toISOString(),
        readableDate: posts[0].date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
    };

    res.render('post-detail', {post: postData});
});


router.get('/posts/:id/edit', function (req,res){
    
    
    
    res.render('update-post');
});

module.exports = router;