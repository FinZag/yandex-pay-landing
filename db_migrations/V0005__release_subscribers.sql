CREATE TABLE IF NOT EXISTS release_subscribers (
    id SERIAL PRIMARY KEY,
    game_id VARCHAR(64) NOT NULL,
    email VARCHAR(320) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    notified_at TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS release_subscribers_game_email_idx
    ON release_subscribers (game_id, lower(email));
