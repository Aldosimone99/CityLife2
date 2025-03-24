CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL
);

ALTER TABLE comments
ADD COLUMN user_id BIGINT,
ADD COLUMN post_id BIGINT,
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id),
ADD CONSTRAINT fk_post_id FOREIGN KEY (post_id) REFERENCES posts(id);