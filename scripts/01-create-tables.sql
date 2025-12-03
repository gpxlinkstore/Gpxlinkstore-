-- Create movies table
CREATE TABLE IF NOT EXISTS movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create download_links table
CREATE TABLE IF NOT EXISTS download_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  quality TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_url ON movies(url);
CREATE INDEX IF NOT EXISTS idx_download_links_movie_id ON download_links(movie_id);
