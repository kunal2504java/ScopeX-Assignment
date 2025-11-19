export type Role = 'ADMIN' | 'MANAGER' | 'USER';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  projectId: string;
  assignedToId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  action: string;
  userId: string;
  details?: string | null;
  createdAt: Date;
}
