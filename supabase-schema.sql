-- Create email_signups table
CREATE TABLE IF NOT EXISTS email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_signups_email ON email_signups(email);

-- Enable Row Level Security
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for signup form)
CREATE POLICY "Allow public inserts" ON email_signups
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow reads only for authenticated users (optional, for admin panel)
CREATE POLICY "Allow authenticated reads" ON email_signups
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT INSERT ON email_signups TO anon;
GRANT SELECT ON email_signups TO authenticated;
