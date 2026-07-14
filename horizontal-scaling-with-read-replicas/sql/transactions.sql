-- Example of a transaction creating a user and their profile atomically
-- This demonstrates that transactions must be executed on the Master
START TRANSACTION;

INSERT INTO Users (username, email) VALUES ('diana', 'diana@example.com');
-- Assuming diana gets ID = 4
SET @diana_id = LAST_INSERT_ID();

INSERT INTO Profiles (user_id, bio, avatar_url) 
VALUES (@diana_id, 'Diana Prince', 'http://example.com/diana.png');

COMMIT;

-- Example of a transaction for posting a photo
START TRANSACTION;

INSERT INTO Posts (user_id, content) VALUES (4, 'Check out my new armor!');
SET @post_id = LAST_INSERT_ID();

INSERT INTO Photos (user_id, post_id, image_url) 
VALUES (4, @post_id, 'http://example.com/diana_armor.png');

COMMIT;
