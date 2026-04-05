-- Fix for the "Database error saving new user" bug
-- Copy and paste this entirely into your Supabase SQL Editor and run it

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- We must explicitly define the public schema or else the auth execution context will lose track of the tables!
  
  -- 1) Create profile
  INSERT INTO public.profiles (id, username, display_name, avatar_preset)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Grinder'),
    'default'
  );

  -- 2) Create streak row
  INSERT INTO public.streaks (user_id) VALUES (NEW.id);

  -- 3) Create default skills
  INSERT INTO public.skills (user_id, name, color, icon) VALUES
    (NEW.id, 'Video Editing', '#7C6FF7', '🎬'),
    (NEW.id, 'Coding',        '#5EC8A0', '💻'),
    (NEW.id, 'Reading',       '#F7A97C', '📚'),
    (NEW.id, 'Design',        '#F07AAB', '🎨'),
    (NEW.id, 'Research',      '#72C8E8', '🔍');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure the trigger uses the newly explicitly scoped function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
