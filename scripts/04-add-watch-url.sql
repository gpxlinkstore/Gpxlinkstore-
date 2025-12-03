ALTER TABLE movies
  ADD COLUMN IF NOT EXISTS watch_url TEXT;

CREATE INDEX IF NOT EXISTS idx_movies_watch_url
  ON movies (watch_url)
  WHERE watch_url IS NOT NULL;
