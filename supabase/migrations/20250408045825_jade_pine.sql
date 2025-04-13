/*
  # Create mood tracking tables and security policies

  1. New Tables
    - `mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `mood_rating` (smallint, 1-5)
      - `note` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `mood_entries` table
    - Add policies for authenticated users to:
      - Read their own entries
      - Insert new entries
      - Delete their own entries
*/

-- Create the mood_entries table
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_rating SMALLINT NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 5),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE public.mood_entries IS 'Stores user mood entries';
COMMENT ON COLUMN public.mood_entries.mood_rating IS '1:Very Sad, 2:Sad, 3:Neutral, 4:Happy, 5:Very Happy';

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_created_at 
ON public.mood_entries(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own mood entries"
ON public.mood_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
ON public.mood_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
ON public.mood_entries
FOR DELETE
USING (auth.uid() = user_id);