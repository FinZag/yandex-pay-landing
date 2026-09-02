CREATE TABLE IF NOT EXISTS t_p34302856_yandex_pay_landing.game_purchases (
  id serial PRIMARY KEY,
  order_id text NOT NULL UNIQUE,
  product_id text NOT NULL,
  player_id text NOT NULL,
  amount integer NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_id text,
  delivered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS game_purchases_player_idx
  ON t_p34302856_yandex_pay_landing.game_purchases (player_id);

CREATE INDEX IF NOT EXISTS game_purchases_status_idx
  ON t_p34302856_yandex_pay_landing.game_purchases (status);