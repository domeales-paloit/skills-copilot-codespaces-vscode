// Create a web server
// Create a route for GET /comments
// Create a route for POST /comments
// Create a route for DELETE /comments
// Create a route for PUT /comments

const express = require('express');
const app = express();
const comments = require('./comments.json');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/comments', (req, res) => {
    res.json(comments);
});

app.post('/comments', (req, res) => {
    const newComment = req.body;
    newComment.id = comments.length + 1;
    comments.push(newComment);

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            res.status(500).json({ message: 'An error has occurred while writing a new comment' });
        } else {
            res.json(newComment);
        }
    });
});

app.delete('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const commentIndex = comments.findIndex((comment) => comment.id === commentId);

    if (commentIndex > -1) {
        comments.splice(commentIndex, 1);

        fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).json({ message: 'An error has occurred while deleting the comment' });
            } else {
                res.json({ message: 'Comment has been deleted' });
            }
        });
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});

app.put('/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const commentIndex = comments.findIndex((comment) => comment.id === commentId);

    if (commentIndex > -1) {
        const updatedComment = { ...comments[commentIndex], ...req.body };

        comments[commentIndex] = updatedComment;

        fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
            if (err) {
                res.status(500).json({ message: 'An error has occurred while updating the comment' });
            } else {
                res.json(updatedComment);
            }
        });
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
});

app