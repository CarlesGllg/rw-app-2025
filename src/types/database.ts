
export type UserRole = 'admin' | 'school' | 'parent';
export type MessagePriority = 'low' | 'medium' | 'high';
export type DocumentType = 'pdf' | 'doc' | 'xls' | 'other';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  sender_id: string;
  priority: MessagePriority;
  created_at: string;
  updated_at: string;
}

export interface MessageAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description: string | null;
  type: DocumentType;
  url: string;
  category: string | null;
  uploader_id: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRead {
  id: string;
  message_id: string;
  user_id: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  created_at: string | null;
  updated_at: string | null;
}
