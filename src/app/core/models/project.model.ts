export interface ProjectModel {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  dueDate?: string;
  progress: number; // 0-100
}
