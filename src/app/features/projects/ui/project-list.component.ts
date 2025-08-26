import {Component, computed, input, InputSignal, output, OutputEmitterRef, Signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ProjectModel, UserModel} from "@core/models";
import {ProjectStatusesEnum, UserRolesEnum} from "@shared/enums";

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="project-list-container">

          <!-- Header with view toggle -->
          <div class="list-header">
              <div class="view-controls">
                  <button class="view-toggle-btn" [class.active]="viewMode() === 'grid'"
                          (click)="changeViewMode.emit('grid')"
                          [disabled]="isLoading()">
                      <svg width="16" height="16" viewBox="0 0 16 16">
                          <rect x="1" y="1" width="6" height="6" rx="1"/>
                          <rect x="9" y="1" width="6" height="6" rx="1"/>
                          <rect x="1" y="9" width="6" height="6" rx="1"/>
                          <rect x="9" y="9" width="6" height="6" rx="1"/>
                      </svg>
                      Grid
                  </button>

                  <button class="view-toggle-btn" [class.active]="viewMode() === 'list'"
                          (click)="changeViewMode.emit('list')"
                          [disabled]="isLoading()">
                      <svg width="16" height="16" viewBox="0 0 16 16">
                          <rect x="2" y="3" width="12" height="2" rx="1"/>
                          <rect x="2" y="7" width="12" height="2" rx="1"/>
                          <rect x="2" y="11" width="12" height="2" rx="1"/>
                      </svg>
                      List
                  </button>
              </div>

              <div class="project-count">
                  @if (!isLoading()) {
                      <span>{{ projects().length }} project{{ projects().length !== 1 ? 's' : '' }}</span>
                  }
              </div>
          </div>

          @if (isLoading()) {
              <!-- Loading State -->
              <div class="loading-container">
                  <div class="loading-spinner"></div>
                  <p>Loading projects...</p>
              </div>
          } @else if (projects().length === 0) {
              <!-- Empty State -->
              <div class="empty-state">
                  <div class="empty-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14,2 14,8 20,8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10,9 9,9 8,9"></polyline>
                      </svg>
                  </div>

                  <h3>No Projects Yet</h3>
                  <p>You're not currently part of any projects.</p>

                  @if (canAddProjects()) {
                      <button class="add-project-btn"
                              (click)="addProject.emit()">
                          <svg width="16" height="16" viewBox="0 0 16 16">
                              <path d="M8 1a.5.5 0 0 1 .5.5v6h6a.5.5 0 0 1 0 1h-6v6a.5.5 0 0 1-1 0v-6h-6a.5.5 0 0 1 0-1h6v-6A.5.5 0 0 1 8 1z"/>
                          </svg>
                          Create Your First Project
                      </button>
                  }
              </div>
          } @else {
              <!-- Projects Grid/List -->
              <div class="projects-container"
                   [class.grid-view]="viewMode() === 'grid'"
                   [class.list-view]="viewMode() === 'list'">

                  @for (project of projects(); track project.id) {
                      <div class="project-item"
                           [class.status-active]="project.status === 'active'"
                           [class.status-completed]="project.status === 'completed'"
                           [class.status-on-hold]="project.status === 'on-hold'"
                           [class.overdue]="isProjectOverdue(project)"
                           (click)="viewProject.emit(project.id)">

                          <!-- Project Header -->
                          <div class="project-header">
                              <h3 class="project-name">{{ project.name }}</h3>
                              <div class="project-status" [attr.data-status]="project.status">
                                  {{ getStatusLabel(project.status) }}
                              </div>
                          </div>

                          <!-- Project Description -->
                          <p class="project-description">{{ project.description }}</p>

                          <!-- Project Progress -->
                          <div class="project-progress">
                              <div class="progress-info">
                                  <span class="progress label">Progress</span>
                                  <span class="progress-percentage">{{ project.progress }}</span>
                              </div>
                              <div class="progress-bar">
                                  <div class="progress-fill"
                                       [style.width.%]="project.progress"
                                       [class.progress-complete]="project.progress === 100">
                                  </div>
                              </div>
                          </div>

                          <!-- Project Meta -->
                          <div class="project-meta">
                              @if (project.dueDate) {
                                  <div class="due-date" [class.overdue]="isProjectOverdue(project)">
                                      <svg width="14" height="14" viewBox="0 0 16 16">
                                          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                                      </svg>
                                      Due {{ formatDueDate(project.dueDate) }}
                                  </div>
                              }

                              <div class="member-count">
                                  <svg width="14" height="14" viewBox="0 0 16 16">
                                      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                      <path fill-rule="evenodd"
                                            d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
                                      <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
                                  </svg>
                                  {{ project.memberIds.length + 1 }} member{{ (project.memberIds.length + 1) !== 1 ? 's' : '' }}
                              </div>
                          </div>

                          <!-- Hover indicator -->
                          <div class="project-hover-indicator">
                              <svg width="16" height="16" viewBox="0 0 16 16">
                                  <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                              </svg>
                          </div>
                      </div>
                  }

              </div>
          }

      </div>
  `,
  styles: [`
    .project-list-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }

    /* Header */
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }

    .view-controls {
      display: flex;
      gap: 0.5rem;
      background: #f5f7fa;
      padding: 0.25rem;
      border-radius: 8px;
    }

    .view-toggle-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      color: #666;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .view-toggle-btn:hover {
      background: white;
      color: #333;
    }

    .view-toggle-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .view-toggle-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .project-count {
      color: #666;
      font-size: 0.875rem;
    }

    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      color: #666;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e0e0e0;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      text-align: center;
    }

    .empty-icon {
      color: #ccc;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .empty-state p {
      margin: 0 0 1.5rem 0;
      color: #666;
      max-width: 400px;
    }

    .add-project-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .add-project-btn:hover {
      background: #5a6fd8;
    }

    /* Projects Container */
    .projects-container {
      width: 100%;
    }

    .projects-container.grid-view {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .projects-container.list-view {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Project Items */
    .project-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
    }

    .project-item:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
    }

    .project-item:hover .project-hover-indicator {
      opacity: 1;
      transform: translateX(0);
    }

    /* Status-based styling */
    .project-item.status-active {
      border-left: 4px solid #10b981;
    }

    .project-item.status-completed {
      border-left: 4px solid #6b7280;
    }

    .project-item.status-on-hold {
      border-left: 4px solid #f59e0b;
    }

    .project-item.overdue {
      border-left: 4px solid #ef4444;
    }

    /* Project Header */
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.75rem;
      gap: 1rem;
    }

    .project-name {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }

    .project-status {
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: capitalize;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .project-status[data-status="active"] {
      background: #d1fae5;
      color: #065f46;
    }

    .project-status[data-status="completed"] {
      background: #f3f4f6;
      color: #374151;
    }

    .project-status[data-status="on-hold"] {
      background: #fef3c7;
      color: #92400e;
    }

    /* Project Description */
    .project-description {
      margin: 0 0 1rem 0;
      color: #666;
      font-size: 0.875rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Project Progress */
    .project-progress {
      margin-bottom: 1rem;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .progress-label {
      font-size: 0.75rem;
      color: #666;
      font-weight: 500;
    }

    .progress-percentage {
      font-size: 0.75rem;
      color: #333;
      font-weight: 600;
    }

    .progress-bar {
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #667eea;
      transition: width 0.3s ease;
      border-radius: 3px;
    }

    .progress-fill.progress-complete {
      background: #10b981;
    }

    /* Project Meta */
    .project-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.75rem;
      color: #666;
    }

    .due-date,
    .member-count {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }

    .due-date.overdue {
      color: #ef4444;
    }

    /* Hover Indicator */
    .project-hover-indicator {
      position: absolute;
      top: 50%;
      right: 1rem;
      transform: translateY(-50%) translateX(10px);
      opacity: 0;
      transition: all 0.2s ease;
      color: #667eea;
    }

    /* List View Specific */
    .projects-container.list-view .project-item {
      padding: 1rem 1.5rem;
    }

    .projects-container.list-view .project-description {
      -webkit-line-clamp: 1;
    }

    /* Responsive Design */
    @media (min-width: 640px) {
      .project-list-container {
        padding: 1.5rem;
      }

      .projects-container.grid-view {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }

      .list-header {
        margin-bottom: 2rem;
      }
    }

    @media (min-width: 1024px) {
      .projects-container.grid-view {
        grid-template-columns: repeat(3, 1fr);
      }

      .project-item {
        padding: 2rem;
      }

      .projects-container.list-view .project-item {
        padding: 1.5rem 2rem;
      }
    }

    @media (max-width: 640px) {
      .list-header {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .view-controls {
        justify-content: center;
      }

      .project-count {
        text-align: center;
      }

      .project-header {
        flex-direction: column;
        align-items: start;
        gap: 0.5rem;
      }

      .project-meta {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ProjectList {

  // --- Inputs
  projects: InputSignal<ProjectModel[]> = input.required<ProjectModel[]>();
  viewMode: InputSignal<'grid' | 'list'> = input.required<'grid' | 'list'>();
  isLoading: InputSignal<boolean> = input.required<boolean>();
  currentUser: InputSignal<UserModel | null | undefined> = input.required<UserModel | null | undefined>();

  // --- Outputs
  viewProject: OutputEmitterRef<string> = output<string>();
  addProject: OutputEmitterRef<void> = output<void>();
  changeViewMode: OutputEmitterRef<'grid' | 'list'> = output<'grid' | 'list'>();

  // --- Computed Properties
  canAddProjects: Signal<boolean> = computed(() => {
    const user = this.currentUser();
    if (!user) return false;

    return user.role === UserRolesEnum.admin
      || user.role === UserRolesEnum.pm;
  });

  // --- Helper Methods
  getStatusLabel(status: ProjectModel['status']): string {
    const statusLabels = {
      [ProjectStatusesEnum.active]: 'Active',
      [ProjectStatusesEnum.completed]: 'Completed',
      [ProjectStatusesEnum.onHold]: 'On Hold',
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  }

  isProjectOverdue(project: ProjectModel): boolean {
    if (!project.dueDate || project.status === ProjectStatusesEnum.completed) {
      return false;
    }

    const now = new Date();
    const dueDate = new Date(project.dueDate);
    return dueDate < now;
  }

  formatDueDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  }
}
