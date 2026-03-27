/*
  # Insert Sample Charities
  
  ## Overview
  This migration adds sample charity organizations to the platform for users to select from.
  
  ## Changes
  - Inserts 6 sample charities with descriptions and websites
  - Marks 2 charities as featured
  - Provides a diverse range of charitable causes related to sports, health, and community
  
  ## Sample Charities Added
  1. The Golf Foundation (Featured) - Youth golf development
  2. Habitat for Humanity - Housing charity
  3. Cancer Research Foundation (Featured) - Medical research
  4. Local Food Bank - Community support
  5. Youth Sports Alliance - Athletic programs for youth
  6. Environmental Conservation Fund - Environmental protection
*/

INSERT INTO charities (name, description, website, is_featured, upcoming_events) VALUES
(
  'The Golf Foundation',
  'Dedicated to providing opportunities for young people to access golf, improving their health, wellbeing, and life skills through the sport. We believe golf can change lives.',
  'https://www.golf-foundation.org',
  true,
  '{"title": "Annual Charity Golf Day", "date": "2026-06-15"}'::jsonb
),
(
  'Habitat for Humanity',
  'Building homes, communities, and hope. We bring people together to build affordable housing and improve communities around the world.',
  'https://www.habitat.org',
  false,
  NULL
),
(
  'Cancer Research Foundation',
  'Funding groundbreaking cancer research to find cures and improve treatments. Every contribution brings us closer to a world without cancer.',
  'https://www.cancerresearch.org',
  true,
  '{"title": "Charity Golf Tournament", "date": "2026-07-20"}'::jsonb
),
(
  'Local Food Bank Network',
  'Fighting hunger in our communities by providing nutritious food to families in need. No one should go to bed hungry.',
  'https://www.feedingamerica.org',
  false,
  NULL
),
(
  'Youth Sports Alliance',
  'Empowering youth through sports. We provide access to quality athletic programs, coaching, and mentorship for underprivileged children.',
  'https://www.youthsports.org',
  false,
  '{"title": "Community Sports Day", "date": "2026-08-10"}'::jsonb
),
(
  'Environmental Conservation Fund',
  'Protecting our planet for future generations. We work on conservation projects, renewable energy, and environmental education worldwide.',
  'https://www.conservation.org',
  false,
  NULL
)
ON CONFLICT DO NOTHING;
