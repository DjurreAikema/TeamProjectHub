import {Component, inject} from '@angular/core';
import {AuthService} from "@features/auth/data-access/auth.service";
import {convertUserRoleToDescriptiveName} from '@features/auth/helpers';
import {UserInfoComponent} from "./user/user-info.component";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    UserInfoComponent
  ],
  template: `
      <nav class="navbar-content">

          <div class="welcome-section">
              <h1>Welcome back, {{ authService.user()?.name }}!</h1>
              <p class="role-badge"> {{ convertUserRoleToDescriptiveName(authService.user()?.role || '') }}</p>
          </div>

          <div class="user-actions">
              <app-user-info [user]="authService.user()"/>

              <button class="logout-btn" (click)="logout()">
                  Logout
              </button>
          </div>

      </nav>
  `,
  styles: [`
    :host {
      width: 100%;
      height: 100%;
      display: block;
    }
    
    .navbar-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
    }
    
    .welcome-section h1 {
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.2;
    }
    
    .welcome-section .role-badge {
      margin: 0;
      font-size: 0.8rem;
      line-height: 1;
    }
    
    .user-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logout-btn {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
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
