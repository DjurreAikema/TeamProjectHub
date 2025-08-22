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

export type AddProjectModel = Omit<ProjectModel, 'id' | 'memberIds' | 'createdAt' | 'progress'>;

export type EditProjectModel = {
  id: ProjectModel['id'];
  data: AddProjectModel;
}

export type RemoveProjectModel = ProjectModel['id'];