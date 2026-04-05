-- ═══════════════════════════════════════
-- GRINDSPACE — PHASE 2 SCHEMA (TASKS & CALENDAR)
-- Paste this into Supabase SQL Editor -> Run
-- ═══════════════════════════════════════

-- 1. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES public.goals(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'completed')),
  estimated_mins integer,
  parent_task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE, -- For subtasks
  scheduled_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. CALENDAR BLOCKS TABLE (Planned vs actual)
CREATE TABLE IF NOT EXISTS public.calendar_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE,
  title text NOT NULL,
  scheduled_date date NOT NULL,
  start_time time,
  end_time time,
  actual_session_id uuid, -- Will link to sessions when actual happens
  created_at timestamptz DEFAULT now()
);

-- 3. MODIFY SESSIONS (Add task_id)
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL;

-- 4. ENABLE RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tasks" ON public.tasks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own calendar blocks" ON public.calendar_blocks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. AUTOMATIC TASK STATUS UPDATE TRIGGER (when linked session finishes)
CREATE OR REPLACE FUNCTION update_task_on_session()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.task_id IS NOT NULL THEN
    UPDATE public.tasks 
    SET status = CASE 
      WHEN status = 'backlog' THEN 'in_progress'
      WHEN status = 'todo' THEN 'in_progress'
      ELSE status
    END
    WHERE id = NEW.task_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_session_task_update ON public.sessions;
CREATE TRIGGER on_session_task_update
  AFTER INSERT ON public.sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_task_on_session();
