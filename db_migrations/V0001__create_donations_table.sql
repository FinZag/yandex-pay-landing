CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    order_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donations_order_id_idx ON donations (order_id);
