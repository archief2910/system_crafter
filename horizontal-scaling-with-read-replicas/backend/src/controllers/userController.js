const db = require('../database/router');

exports.createUser = async (req, res, next) => {
    try {
        const { username, email } = req.body;
        
        // This is an INSERT, so the router will send it to the Master
        const [result] = await db.query(
            'INSERT INTO Users (username, email) VALUES (?, ?)',
            [username, email]
        );
        
        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        // This is a SELECT, so the router will send it to the Replica
        const [users] = await db.query('SELECT * FROM Users ORDER BY created_at DESC');
        
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { userId, bio, avatarUrl } = req.body;

        // Using REPLACE INTO or INSERT ... ON DUPLICATE KEY UPDATE goes to Master
        const [result] = await db.query(
            `INSERT INTO Profiles (user_id, bio, avatar_url) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE bio = VALUES(bio), avatar_url = VALUES(avatar_url)`,
            [userId, bio, avatarUrl]
        );

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        next(error);
    }
};
