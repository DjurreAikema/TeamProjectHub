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
      <nav class="navbar">

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
    .navbar {
      width: 100%;
      height: 100%;
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
