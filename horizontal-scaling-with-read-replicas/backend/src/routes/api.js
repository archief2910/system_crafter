const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const postController = require('../controllers/postController');

// User Routes
router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.put('/profile', userController.updateProfile);

// Post Routes
router.post('/posts', postController.createPost);
router.get('/posts', postController.getPosts);
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
