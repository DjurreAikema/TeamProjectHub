import {Component, effect, inject, signal} from '@angular/core';
import {LoginDialogComponent} from './ui/login-dialog.component';
import {AuthService} from './data-access/auth.service';
import {Router} from '@angular/router';
import {UserModel} from "@core/models";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginDialogComponent],
  template: `
      @if (!authService.isAuthenticated()) {
          <app-login-dialog
                  [isLoading]="authService.isLoading()"
                  [quickLoginUsers]="quickLoginUsers()"
                  [authError]="authService.error()"

                  (loginWithUserId)="loginWithUserId($event)"
          />
      }
  `,
  styles: ``
})
export default class LoginComponent {
  // --- Dependencies
  authService = inject(AuthService);
  router = inject(Router);

  // --- Properties
  quickLoginUsers = signal<UserModel[]>([]);

  // --- Constructor
  constructor() {
    // Redirect to dashboard of already authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });

    this.quickLoginUsers.set(this.authService.getUsersForQuickLogin());
  }

  // --- Methods
  loginWithUserId(userId: string): void {
    if (this.authService.isLoading()) return;
    this.authService.login(userId);
  }
}
