export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'completed'

export interface Task {
  id: string
  user_id: string
  goal_id: string | null
  title: string
  status: TaskStatus
  estimated_mins: number | null
  parent_task_id: string | null
  scheduled_date: string | null
  created_at: string
  updated_at: string
  
  // Relations (optional inclusion)
  subtasks?: Task[]
}

export interface CalendarBlock {
  id: string
  user_id: string
  task_id: string | null
  title: string
  scheduled_date: string
  start_time: string | null
  end_time: string | null
  actual_session_id: string | null
  created_at: string
}
