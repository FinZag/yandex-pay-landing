ALTER TABLE t_p34302856_yandex_pay_landing.game_purchases
  ADD COLUMN IF NOT EXISTS game_id text NOT NULL DEFAULT 'bytetrace';

CREATE INDEX IF NOT EXISTS game_purchases_game_idx
  ON t_p34302856_yandex_pay_landing.game_purchases (game_id);