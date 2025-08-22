// Import project data
import projectsData from '../../../data/projects.json';
import {Injectable} from '@angular/core';
import {CreateProjectModel, EditProjectModel, ProjectModel} from "@core/models";
import {delay, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockProjectApiService {

  loadProjects(): Observable<ProjectModel[]> {
    try {
      const projects = projectsData as ProjectModel[];
      // Simulate network delay
      return of(projects).pipe(delay(300));
    } catch (error) {
      return throwError(() => new Error('Failed to load projects'));
    }
  }

  createProject(project: CreateProjectModel): Observable<ProjectModel> {
    const newProject: ProjectModel = {
      ...project,
      id: this.generateId(),
      memberIds: [],
      createdAt: new Date().toISOString(),
      progress: 0
    };

    return of(newProject).pipe(delay(500))
  }

  updateProject(id: string, updates: EditProjectModel) {
  }

  deleteProject(id: string) {
  }

  // --- Internal helpers
  private generateId(): string {
    return 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
