const db = require('../database/router');

exports.createPost = async (req, res, next) => {
    try {
        const { userId, content } = req.body;
        
        // INSERT goes to Master
        const [result] = await db.query(
            'INSERT INTO Posts (user_id, content) VALUES (?, ?)',
            [userId, content]
        );
        
        res.status(201).json({
            message: 'Post created successfully',
            postId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

exports.getPosts = async (req, res, next) => {
    try {
        // SELECT goes to Replica
        const [posts] = await db.query(
            `SELECT p.id, p.content, p.created_at, u.username 
             FROM Posts p 
             JOIN Users u ON p.user_id = u.id 
             ORDER BY p.created_at DESC`
        );
        
        res.status(200).json(posts);
    } catch (error) {
        next(error);
    }
};

exports.deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // DELETE goes to Master
        await db.query('DELETE FROM Posts WHERE id = ?', [id]);
        
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};
