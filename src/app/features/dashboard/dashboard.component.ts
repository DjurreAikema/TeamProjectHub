import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectList} from "@features/projects/ui/project-list.component";
import {ProjectService} from "@features/projects/data-access/project.service";
import {DashboardService} from "@features/dashboard/data-access/dashboard.service";
import {AuthService} from "@features/auth/data-access/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ProjectList],
  template: `
      <app-project-list
              [projects]="projectService.currentUsersProjects()"
              [viewMode]="dashboardService.selectedView()"
              [isLoading]="projectService.isLoading()"
              [currentUser]="authService.user()"
      />
      
<!--      <div class="dashboard-container">-->

<!--          <main class="dashboard-content">-->
<!--              <div class="dashboard-grid">-->

<!--                  <div class="dashboard-card">-->
<!--                      <h3>Projects</h3>-->
<!--                      <p>Manage your teams projects</p>-->
<!--                  </div>-->

<!--                  <div class="dashboard-card">-->
<!--                      <h3>Tasks</h3>-->
<!--                      <p>Track and update task progress</p>-->
<!--                  </div>-->

<!--                  <div class="dashboard-card">-->
<!--                      <h3>Analytics</h3>-->
<!--                      <p>View project performance</p>-->
<!--                  </div>-->

<!--                  <div class="dashboard-card">-->
<!--                      <h3>Team</h3>-->
<!--                      <p>Collaborate with team members</p>-->
<!--                  </div>-->

<!--                  <app-project-list-->
<!--                          [projects]="projectService.currentUsersProjects()"-->
<!--                          [viewMode]="dashboardService.selectedView()"-->
<!--                          [isLoading]="projectService.isLoading()"-->
<!--                          [currentUser]="authService.user()"-->
<!--                  />-->

<!--              </div>-->
<!--          </main>-->
<!--      </div>-->
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .dashboard-content {
      padding: 2rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
    }

    .dashboard-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .dashboard-card h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .dashboard-card p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 1rem;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export default class DashboardComponent {

  // --- Dependencies
  projectService: ProjectService = inject(ProjectService);
  dashboardService: DashboardService = inject(DashboardService);
  authService: AuthService = inject(AuthService);

}
