-- Create admin_settings table for storing admin configuration
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin password
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('admin_password', 'ankit07')
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- Create function to update admin password
CREATE OR REPLACE FUNCTION update_admin_password(new_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE admin_settings 
  SET setting_value = new_password, updated_at = NOW()
  WHERE setting_key = 'admin_password';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to get admin password
CREATE OR REPLACE FUNCTION get_admin_password()
RETURNS TEXT AS $$
DECLARE
  password TEXT;
BEGIN
  SELECT setting_value INTO password
  FROM admin_settings 
  WHERE setting_key = 'admin_password';
  
  RETURN COALESCE(password, 'ankit07');
END;
$$ LANGUAGE plpgsql;
