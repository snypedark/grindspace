-- ═══════════════════════════════════════
-- GRINDSPACE — TRIGGER FIX
-- Copy this ENTIRE block into Supabase SQL Editor → Run
-- Fixes: "Database error saving new user" on signup
-- Fixes: "Invalid login credentials" on login (caused by failed signup)
-- ═══════════════════════════════════════

-- ══════════════════════════════
-- FIX 1: handle_new_user (signup trigger)
-- Problem: Missing SET search_path = public
-- When auth fires this trigger, it runs inside the "auth" schema.
-- Without explicit search_path, it can't find profiles/streaks/skills tables.
-- ══════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, display_name, avatar_preset)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Grinder'),
    'default'
  );

  -- Create streak row
  INSERT INTO public.streaks (user_id) VALUES (NEW.id);

  -- Create default skills
  INSERT INTO public.skills (user_id, name, color, icon) VALUES
    (NEW.id, 'Video Editing', '#7C6FF7', '🎬'),
    (NEW.id, 'Coding',        '#5EC8A0', '💻'),
    (NEW.id, 'Reading',       '#F7A97C', '📚'),
    (NEW.id, 'Design',        '#F07AAB', '🎨'),
    (NEW.id, 'Research',      '#72C8E8', '🔍');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate trigger pointing to the fixed function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ══════════════════════════════
-- FIX 2: handle_session_insert (session logging trigger)
-- Same search_path fix applied
-- ══════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_session_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_streak_row      public.streaks%ROWTYPE;
  v_today           date := DATE(NEW.logged_at AT TIME ZONE 'UTC');
  v_xp_earned       integer;
  v_new_streak      integer;
  v_new_level       integer;
  v_current_level   integer;
  v_current_xp      integer;
  v_streak_multi    numeric;
  v_mood_multi      numeric;
BEGIN
  -- 1. Calculate XP
  v_streak_multi := LEAST(1.5, 1 + (
    SELECT current_streak * 0.01 FROM public.streaks WHERE user_id = NEW.user_id
  ));
  v_mood_multi := CASE NEW.mood
    WHEN 'locked_in'  THEN 1.2
    WHEN 'struggling' THEN 0.9
    ELSE 1.0
  END;
  v_xp_earned := FLOOR((NEW.duration_mins::numeric / 6) * v_streak_multi * v_mood_multi);
  
  UPDATE public.sessions SET xp_earned = v_xp_earned WHERE id = NEW.id;

  -- 2. Update skill total_hours
  IF NEW.skill_id IS NOT NULL THEN
    UPDATE public.skills 
    SET total_hours = total_hours + (NEW.duration_mins::numeric / 60)
    WHERE id = NEW.skill_id;
  END IF;

  -- 3. Update profile stats
  SELECT xp, level INTO v_current_xp, v_current_level
  FROM public.profiles WHERE id = NEW.user_id;
  
  v_current_xp  := v_current_xp + v_xp_earned;
  v_new_level   := GREATEST(1, FLOOR(1 + SQRT(v_current_xp::numeric / 50)));

  UPDATE public.profiles SET
    xp              = v_current_xp,
    level           = v_new_level,
    total_hours     = total_hours + (NEW.duration_mins::numeric / 60),
    sessions_logged = sessions_logged + 1,
    last_seen_at    = now()
  WHERE id = NEW.user_id;

  -- 4. Level up notification
  IF v_new_level > v_current_level THEN
    INSERT INTO public.notifications (user_id, type, message)
    VALUES (NEW.user_id, 'level_up', 
      'You reached Level ' || v_new_level || '! 🎉');
  END IF;

  -- 5. Update streak
  SELECT * INTO v_streak_row FROM public.streaks WHERE user_id = NEW.user_id;
  
  IF v_streak_row.last_active_date IS NULL OR 
     v_streak_row.last_active_date < v_today - 1 THEN
    v_new_streak := 1;
  ELSIF v_streak_row.last_active_date = v_today - 1 THEN
    v_new_streak := v_streak_row.current_streak + 1;
  ELSE
    v_new_streak := v_streak_row.current_streak;
  END IF;

  UPDATE public.streaks SET
    current_streak    = v_new_streak,
    longest_streak    = GREATEST(longest_streak, v_new_streak),
    last_active_date  = v_today,
    total_active_days = total_active_days + CASE 
      WHEN last_active_date != v_today THEN 1 ELSE 0 
    END,
    updated_at        = now()
  WHERE user_id = NEW.user_id;

  -- 6. Update goal progress
  UPDATE public.goals SET
    hours_logged = hours_logged + (NEW.duration_mins::numeric / 60),
    earnings_logged = earnings_logged + COALESCE(NEW.earnings, 0),
    is_completed = CASE 
      WHEN target_hours IS NOT NULL 
        AND hours_logged + (NEW.duration_mins::numeric / 60) >= target_hours 
      THEN true 
      ELSE is_completed 
    END
  WHERE user_id = NEW.user_id
    AND is_active = true
    AND start_date <= DATE(NEW.logged_at)
    AND end_date   >= DATE(NEW.logged_at)
    AND (skill_id = NEW.skill_id OR skill_id IS NULL);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_session_insert ON public.sessions;
CREATE TRIGGER on_session_insert
  AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_session_insert();


-- ══════════════════════════════
-- FIX 3: handle_friend_request (notification trigger)
-- Same search_path fix applied
-- ══════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_friend_request()
RETURNS TRIGGER AS $$
DECLARE
  v_username text;
BEGIN
  IF NEW.status = 'pending' AND (TG_OP = 'INSERT') THEN
    SELECT username INTO v_username FROM public.profiles WHERE id = NEW.requester_id;
    INSERT INTO public.notifications (user_id, type, actor_id, entity_id, entity_type, message)
    VALUES (
      NEW.addressee_id,
      'friend_request',
      NEW.requester_id,
      NEW.id,
      'friendship',
      v_username || ' sent you a friend request'
    );
  END IF;

  IF NEW.status = 'accepted' AND TG_OP = 'UPDATE' THEN
    SELECT username INTO v_username FROM public.profiles WHERE id = NEW.addressee_id;
    INSERT INTO public.notifications (user_id, type, actor_id, entity_id, entity_type, message)
    VALUES (
      NEW.requester_id,
      'request_accepted',
      NEW.addressee_id,
      NEW.id,
      'friendship',
      v_username || ' accepted your friend request'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_friendship_change ON public.friendships;
CREATE TRIGGER on_friendship_change
  AFTER INSERT OR UPDATE ON public.friendships
  FOR EACH ROW EXECUTE FUNCTION public.handle_friend_request();


-- ══════════════════════════════
-- FIX 4: update_last_seen (message trigger)
-- Fixed: messages table uses sender_id, not user_id
-- ══════════════════════════════
CREATE OR REPLACE FUNCTION public.update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET last_seen_at = now() WHERE id = NEW.sender_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
CREATE TRIGGER on_message_sent
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_last_seen();


-- ═══════════════════════════════════════
-- DONE! Now go to grindspace.tech/signup and try creating an account.
-- Both signup and login should work after this.
-- ═══════════════════════════════════════
