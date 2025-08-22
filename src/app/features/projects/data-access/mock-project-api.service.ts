// Import project data
import initialProjectsData from '../../../data/projects.json';
import {Injectable} from '@angular/core';
import {CreateProjectModel, EditProjectModel, ProjectModel} from "@core/models";
import {delay, Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MockProjectApiService {

  // --- Properties
  private readonly STORAGE_KEY = 'tpmh_projects';
  private readonly NETWORK_DELAY = 300;

  // --- Constructor
  constructor() {
    this.initializeStorage();
  }

  // --- CRUD Operations
  loadProjects(): Observable<ProjectModel[]> {
    try {
      const projects = this.getProjectsFromStorage();
      return of(projects).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error('Failed to load projects from storage'));
    }
  }

  createProject(projectData: CreateProjectModel): Observable<ProjectModel> {
    try {
      const projects = this.getProjectsFromStorage();

      const newProject: ProjectModel = {
        ...projectData,
        id: this.generateId(),
        memberIds: [],
        createdAt: new Date().toISOString(),
        progress: 0
      };

      const updatedProjects = [...projects, newProject];
      this.saveProjectsToStorage(updatedProjects);

      return of(newProject).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error('Failed to create projects'));
    }
  }

  updateProject(id: string, updates: CreateProjectModel): Observable<ProjectModel> {
    try {
      const projects = this.getProjectsFromStorage();
      const projectIndex = projects.findIndex(p => p.id === id);

      if (projectIndex === -1) {
        return throwError(() => new Error(`Project with id ${id} not found`));
      }

      const existingProject = projects[projectIndex];
      const updatedProject: ProjectModel = {
        ...existingProject,
        ...updates,
        id: existingProject.id,
        createdAt: existingProject.createdAt,
        memberIds: existingProject.memberIds,
        progress: existingProject.progress
      };

      projects[projectIndex] = updatedProject;
      this.saveProjectsToStorage(projects);

      return of(updatedProject).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error(`Failed to update project: ${error}`));
    }
  }

  deleteProject(id: string): Observable<string> {
    try {
      const projects = this.getProjectsFromStorage();
      const projectExists = projects.some(p => p.id === id);

      if (!projectExists) {
        return throwError(() => new Error(`Project with id ${id} not found`));
      }

      const filteredProjects = projects.filter(p => p.id !== id);
      this.saveProjectsToStorage(filteredProjects);

      return of(id).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error(`Failed to delete project: ${error}`));
    }
  }

  // --- Additional Operations
  addMemberToProject(projectId: string, userId: string): Observable<ProjectModel> {
    try {
      const projects = this.getProjectsFromStorage();
      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        return throwError(() => Error(`Project with id ${projectId} not found`));
      }

      const project = projects[projectIndex];

      // Check if user is already a member
      if (project.memberIds.includes(userId)) {
        return throwError(() => Error(`User is already a member of this project`));
      }

      project.memberIds = [...project.memberIds, userId];
      projects[projectIndex] = project;
      this.saveProjectsToStorage(projects);

      return of(project).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error(`Failed to add member to project: ${error}`));
    }
  }

  removeMemberFromProject(projectId: string, userId: string): Observable<ProjectModel> {
    try {
      const projects = this.getProjectsFromStorage();
      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        return throwError(() => Error(`Project with id ${projectId} not found`));
      }

      const project = projects[projectIndex];
      project.memberIds = project.memberIds.filter(id => id !== userId);
      projects[projectIndex] = project;
      this.saveProjectsToStorage(projects);

      return of(project).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error(`Failed to remove member from project: ${error}`));
    }
  }

  updateProjectProgress(projectId: string, progress: number): Observable<ProjectModel> {
    try {
      const projects = this.getProjectsFromStorage();
      const projectIndex = projects.findIndex(p => p.id === projectId);

      if (projectIndex === -1) {
        return throwError(() => Error(`Project with id ${projectId} not found`));
      }

      const project = projects[projectIndex];
      project.progress = Math.max(0, Math.min(100, progress));
      projects[projectIndex] = project;
      this.saveProjectsToStorage(projects);

      return of(project).pipe(delay(this.NETWORK_DELAY));
    } catch (error) {
      return throwError(() => new Error(`Failed to remove member from project: ${error}`));
    }
  }

  // --- Storage Management
  private initializeStorage(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      this.saveProjectsToStorage(initialProjectsData as ProjectModel[])
    }
  }

  private getProjectsFromStorage(): ProjectModel[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading projects from storage: ', error);
      return initialProjectsData as ProjectModel[];
    }
  }

  private saveProjectsToStorage(projects: ProjectModel[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Error saving projects to storage: ', error);
      throw new Error('Failed to save projects to storage');
    }
  }

  // --- Helper Methods
  private generateId(): string {
    return 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
  }
}
