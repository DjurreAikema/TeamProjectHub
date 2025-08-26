import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {CreateProjectModel, EditProjectModel, ProjectModel, RemoveProjectModel} from "@core/models";
import {MockProjectApiService} from "@features/projects/data-access/mock-project-api.service";
import {AuthService} from "@features/auth/data-access/auth.service";
import {UserRolesEnum} from "@shared/enums";
import {catchError, EMPTY, map, merge, Subject, switchMap} from "rxjs";
import {connect} from "ngxtension/connect";

interface ProjectState {
  projects: ProjectModel[];
  error: string | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  // --- Dependencies
  private projectApi: MockProjectApiService = inject(MockProjectApiService);
  private authService: AuthService = inject(AuthService);

  // --- Project State
  private state: WritableSignal<ProjectState> = signal<ProjectState>({
    projects: [],
    error: null,
    isLoading: false
  });

  // --- Project Selectors
  projects: Signal<ProjectModel[]> = computed(() => this.state().projects);
  error: Signal<string | null> = computed(() => this.state().error);
  isLoading: Signal<boolean> = computed(() => this.state().isLoading);

  currentUsersProjects: Signal<ProjectModel[]> = computed(() => {
    const currentUser = this.authService.user();
    if (!currentUser) return [];

    const allProjects = this.projects();

    // Admin can see all projects
    if (currentUser.role === UserRolesEnum.admin) {
      return allProjects;
    }

    // Other users see projects they own or are members of
    return allProjects.filter(project =>
      project.ownerId === currentUser.id
      || project.memberIds.includes(currentUser.id)
    );
  });

  // --- Project Sources
  add$: Subject<CreateProjectModel> = new Subject<CreateProjectModel>();
  edit$: Subject<EditProjectModel> = new Subject<EditProjectModel>();
  remove$: Subject<RemoveProjectModel> = new Subject<RemoveProjectModel>();
  load$: Subject<void> = new Subject<void>();
  error$: Subject<string> = new Subject<string>();

  // API operation streams
  private projectsLoaded$ = this.load$.pipe(
    switchMap(() => this.projectApi.loadProjects()),
    catchError((error) => {
      this.error$.next(error.message || 'Failed to load projects');
      return EMPTY;
    })
  );

  private projectAdded$ = this.add$.pipe(
    switchMap((project) => this.projectApi.createProject(project)),
    catchError((error) => {
      this.error$.next(error.message || 'Failed to create project');
      return EMPTY;
    })
  );

  private projectEdited$ = this.edit$.pipe(
    switchMap((update) => this.projectApi.updateProject(update.id, update.data)),
    catchError((error) => {
      this.error$.next(error.message || 'Failed to update project');
      return EMPTY;
    })
  );

  private projectRemoved$ = this.remove$.pipe(
    switchMap((id) => this.projectApi.deleteProject(id)),
    catchError((error) => {
      this.error$.next(error.message || 'Failed to delete project');
      return EMPTY;
    })
  );

  // --- Project Reducers
  constructor() {
    const nextState$ = merge(
      // Loading state reducers
      this.load$.pipe(map(() => ({isLoading: true, error: null}))),
      this.add$.pipe(map(() => ({isLoading: true, error: null}))),
      this.edit$.pipe(map(() => ({isLoading: true, error: null}))),
      this.remove$.pipe(map(() => ({isLoading: true, error: null}))),

      // projectsLoaded$ reducer
      this.projectsLoaded$.pipe(
        map((projects) => ({
          projects,
          isLoading: false,
          error: null
        }))
      ),

      // projectAdded$ reducer
      this.projectAdded$.pipe(
        map((newProject) => ({
          projects: [...this.state().projects, newProject],
          isLoading: false,
          error: null
        }))
      ),

      // projectEdited$ reducer
      this.projectEdited$.pipe(
        map((updatedProject) => ({
          projects: this.state().projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
          ),
          isLoading: false,
          error: null
        }))
      ),

      // projectRemoved$ reducer
      this.projectRemoved$.pipe(
        map((deletedId) => ({
          projects: this.state().projects.filter(p => p.id !== deletedId),
          isLoading: false,
          error: null
        }))
      ),

      // error$ reducer
      this.error$.pipe(
        map((error) => ({
          error,
          isLoading: false
        }))
      )
    );

    connect(this.state).with(nextState$);

    // Auto-load projects on service initialization
    this.load$.next();
  }
}
