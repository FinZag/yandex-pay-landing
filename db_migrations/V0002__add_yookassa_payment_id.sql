ALTER TABLE t_p34302856_yandex_pay_landing.donations
  ADD COLUMN IF NOT EXISTS payment_id text;

CREATE INDEX IF NOT EXISTS donations_payment_id_idx
  ON t_p34302856_yandex_pay_landing.donations (payment_id);