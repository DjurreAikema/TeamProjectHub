import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../auth/data-access/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">

        <div class="welcome-section">
          <h1>Welcome back, {{ authService.user()?.name }}!</h1>
          <p class="role-badge"> {{ getRoleDisplay(authService.user()?.role || '') }}</p>
        </div>

        <div class="user-actions">
          <div class="user-info">
            <img [src]="authService.user()?.avatar" [alt]="authService.user()?.name + ' avatar'" class="user-avatar"/>
            <span class="user-name">{{ authService.user()?.name }}</span>
          </div>

          <button class="logout-btn" (click)="logout()">
            Logout
          </button>
        </div>

      </header>

      <main class="dashboard-content">
        <div class="dashboard-grid">

          <div class="dashboard-card">
            <h3>Projects</h3>
            <p>Manage your teams projects</p>
          </div>

          <div class="dashboard-card">
            <h3>Tasks</h3>
            <p>Track and update task progress</p>
          </div>

          <div class="dashboard-card">
            <h3>Analytics</h3>
            <p>View project performance</p>
          </div>

          <div class="dashboard-card">
            <h3>Team</h3>
            <p>Collaborate with team members</p>
          </div>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .dashboard-header {
      background: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .welcome-section h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.8rem;
    }

    .role-badge {
      background: #667eea;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }

    .user-name {
      font-weight: 600;
      color: #333;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s ease;
    }

    .logout-btn:hover {
      background: #c82333;
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
      .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

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
  authService = inject(AuthService);

  // --- Methods
  logout(): void {
    this.authService.logout();
  }

  // TODO Re-used method
  getRoleDisplay(role: string): string {
    const roleMap = {
      'admin': 'Administrator',
      'pm': 'Project Manager',
      'developer': 'Developer',
      'viewer': 'Viewer',
    }
    return roleMap[role as keyof typeof roleMap] || role;
  }
}
