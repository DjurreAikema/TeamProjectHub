import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddProjectModel, EditProjectModel, ProjectModel, RemoveProjectModel} from "@core/models";
import {Observable, Subject, take} from "rxjs";
import {MockProjectApiService} from "@features/projects/data-access/mock-project-api.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

interface DashboardState {
  projects: ProjectModel[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // --- Dependencies
  private projectsApi: MockProjectApiService = inject(MockProjectApiService);

  // --- State
  private state: WritableSignal<DashboardState> = signal<DashboardState>({
    projects: [],
    loaded: false,
    error: null,
  });

  // --- Selectors
  public projects: Signal<ProjectModel[]> = computed(() => this.state().projects);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);
  public error: Signal<string | null> = computed(() => this.state().error);

  // --- Sources
  public add$: Subject<AddProjectModel> = new Subject<AddProjectModel>();
  public edit$: Subject<EditProjectModel> = new Subject<EditProjectModel>();
  public remove$: Subject<RemoveProjectModel> = new Subject<RemoveProjectModel>();

  private projectsLoaded$: Observable<ProjectModel[]> = this.projectsApi.loadProjects()

  // --- Reducers
  constructor() {
    // projectsLoaded$ reducer
    this.projectsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (projects) =>
        this.state.update((state) => ({
          ...state,
          projects,
          loaded: true
        })),
      error: (err) => this.state.update((state) => ({...state, error: err}))
    });

    // add reducer$
    this.add$.pipe(takeUntilDestroyed()).subscribe((project) =>
      this.state.update((state) => ({
        ...state,
        // projects: [...state.projects, this.addIdToProject(project)],
      }))
    );

    // edit$ reducer

    // remove$ reducer
  }

  // --- Methods
  private addIdToProject(project: AddProjectModel) {
    return {
      ...project,
      id: this.generateSlug(project.name)
    };
  }

  private generateSlug(name: string): string {
    let slug = name.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.projects().find(
      (project) => project.id === slug
    );

    // If the name is already being used, add a string to make the slug unique
    if (matchingSlugs) slug = slug + Date.now().toString();

    return slug;
  }
}
