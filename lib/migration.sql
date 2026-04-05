-- ============================================================
-- GrindSpace Phase 2 Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Add XP column to profiles (if not already present)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp integer DEFAULT 0;

-- 2. Create friendships table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  created_at timestamptz DEFAULT now(),
  -- Prevent duplicate friendships
  UNIQUE(requester_id, receiver_id)
);

-- 3. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_friendships_requester ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_receiver ON friendships(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 4. RLS for friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Users can read friendships they are part of
CREATE POLICY "Users can view own friendships" ON friendships
  FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = receiver_id
  );

-- Users can insert friendship requests (as requester)
CREATE POLICY "Users can send friend requests" ON friendships
  FOR INSERT WITH CHECK (
    auth.uid() = requester_id
  );

-- Users can update friendships they received (accept/reject)
CREATE POLICY "Users can respond to friend requests" ON friendships
  FOR UPDATE USING (
    auth.uid() = receiver_id
  );

-- Users can delete friendships they are part of
CREATE POLICY "Users can remove friendships" ON friendships
  FOR DELETE USING (
    auth.uid() = requester_id OR auth.uid() = receiver_id
  );

-- 5. Function to increment XP when a session is logged
CREATE OR REPLACE FUNCTION increment_xp_on_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET xp = xp + NEW.duration_minutes
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger: auto-increment XP on session insert
DROP TRIGGER IF EXISTS trigger_increment_xp ON sessions;
CREATE TRIGGER trigger_increment_xp
  AFTER INSERT ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION increment_xp_on_session();

-- 7. Backfill XP for existing users (based on existing sessions)
UPDATE profiles
SET xp = COALESCE((
  SELECT SUM(duration_minutes)
  FROM sessions
  WHERE sessions.user_id = profiles.id
), 0);

-- 8. Make profiles readable by all authenticated users (for leaderboard + search)
-- NOTE: Only add this if you don't have a SELECT policy already
-- Check existing policies first in Supabase Dashboard → Auth → Policies
CREATE POLICY "Authenticated users can view all profiles" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');
