-- Add order column to download_links table to maintain link sequence
ALTER TABLE download_links ADD COLUMN IF NOT EXISTS link_order INTEGER DEFAULT 0;

-- Create index for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_download_links_order ON download_links(movie_id, link_order);
