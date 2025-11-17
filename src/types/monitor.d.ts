export interface PageParams {
  page: string | number;
  per_page: string | number;
}

export interface ITask {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  platform: number;
  type: number;
  status: number;
  is_disabled: number;
  create_date: string;
}

export interface CreateTaskData {
  name: string;
  start_date: string,
  end_date: string,
  platform: number;
  type: number;
}

export interface UpdateTaskData {
  task_id: number;
  name: string;
}


export interface ITaskNote {
  id: number;
  note_id: string;
  note_link: string;
  title?: string;
  desc?: string;
  nickname?: string;
  images?: string[];
  video_url?: string;
  comments_count?: number;
  likes_count?: number;
  collected_count?: number;
  share_count?: number;
  note_status: number;
  created_date: string;
  updated_date: string;
}

export interface ITaskNoteLog {
  id: number;
  note_id: string;
  collected_count: string;
  comments_count: string;
  likes_count: string;
  share_count: string;
  updated_date: string;
}

export interface ITaskNoteSummary {
  id: number;
  note_id: string;
  [key: string]: any;
}