import {Component, inject} from '@angular/core';
import {AuthService} from "../../features/auth/data-access/auth.service";
import {convertUserRoleToDescriptiveName} from '../../features/auth/helpers/convert-user-role-to-descriptive-name.helper';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  template: `
      <header class="dashboard-header">

          <div class="welcome-section">
              <h1>Welcome back, {{ authService.user()?.name }}!</h1>
              <p class="role-badge"> {{ convertUserRoleToDescriptiveName(authService.user()?.role || '') }}</p>
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
  `,
  styles: [`
    
  `]
})
export class NavbarComponent {
  // --- Dependencies
  authService = inject(AuthService);

  // --- Methods
  logout(): void {
    this.authService.logout();
  }

  // --- Helpers
  protected readonly convertUserRoleToDescriptiveName = convertUserRoleToDescriptiveName;
}
