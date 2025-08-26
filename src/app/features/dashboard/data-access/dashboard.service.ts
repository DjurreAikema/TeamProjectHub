import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';

import {ProjectService} from "@features/projects/data-access/project.service";
import {AuthService} from "@features/auth/data-access/auth.service";
import {ProjectStatusesEnum} from "@shared/enums";

interface DashboardState {
  selectedView: 'grid' | 'list';
  isLoading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // --- Dependencies
  private projectsService: ProjectService = inject(ProjectService);
  private authService: AuthService = inject(AuthService);

  // --- Dashboard State
  private state: WritableSignal<DashboardState> = signal<DashboardState>({
    selectedView: 'list',
    isLoading: false,
    error: null,
  });

  // --- Dashboard Selectors
  public selectedView: Signal<'grid' | 'list'> = computed(() => this.state().selectedView);
  public isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  public error: Signal<string | null> = computed(() => this.state().error);

  public recentProjects = computed(() => {
    const projects = this.projectsService.currentUsersProjects();
    return projects
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  });

  public urgentProjects = computed(() => {
    const projects = this.projectsService.currentUsersProjects();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return projects.filter(p => {
      if (!p.dueDate || p.status === ProjectStatusesEnum.completed) return false;
      const dueDate = new Date(p.dueDate);
      return dueDate <= nextWeek;
    });
  });

  public dashboardStats: Signal<any> = computed(() => {
    const projects = this.projectsService.currentUsersProjects();
    const user = this.authService.user();

    if (!user || !projects) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        onHoldProjects: 0,
        averageProgress: 0
      };
    }

    const activeProjects = projects.filter(p => p.status === ProjectStatusesEnum.active);
    const completedProjects = projects.filter(p => p.status === ProjectStatusesEnum.completed);
    const onHoldProjects = projects.filter(p => p.status === ProjectStatusesEnum.onHold);

    const totalProgress = projects.reduce((sum, p) => sum + p.progress, 0);
    const averageProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0;

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      onHoldProjects: onHoldProjects.length,
      averageProgress
    }
  });
}
