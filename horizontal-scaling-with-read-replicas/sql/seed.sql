-- Insert some initial dummy data
INSERT INTO Users (username, email) VALUES 
('alice', 'alice@example.com'),
('bob', 'bob@example.com'),
('charlie', 'charlie@example.com');

INSERT INTO Profiles (user_id, bio, avatar_url) VALUES
(1, 'Hello I am Alice', 'http://example.com/alice.png'),
(2, 'Bob the builder', 'http://example.com/bob.png'),
(3, 'Charlie Chaplin', 'http://example.com/charlie.png');

INSERT INTO Posts (user_id, content) VALUES
(1, 'My first post!'),
(2, 'Building something cool today.'),
(3, 'Just another day in paradise.');

INSERT INTO Photos (user_id, post_id, image_url) VALUES
(1, 1, 'http://example.com/alice_photo1.png'),
(2, 2, 'http://example.com/bob_photo1.png');

INSERT INTO Followers (follower_id, followee_id) VALUES
(2, 1), -- Bob follows Alice
(3, 1), -- Charlie follows Alice
(1, 2); -- Alice follows Bob

INSERT INTO PostLikes (user_id, post_id) VALUES
(2, 1), -- Bob likes Alice's post
(3, 1); -- Charlie likes Alice's post

INSERT INTO PhotoLikes (user_id, photo_id) VALUES
(2, 1); -- Bob likes Alice's photo
