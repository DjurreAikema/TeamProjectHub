import {Component, effect, inject} from '@angular/core';
import {LoginDialogComponent} from './ui/login-dialog.component';
import {AuthService} from './data-access/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginDialogComponent],
  template: `
    @if (!authService.isAuthenticated()) {
      <app-login-dialog/>
    }
  `,
  styles: ``
})
export default class LoginComponent {
  // --- Dependencies
  authService = inject(AuthService);
  router = inject(Router);

  // --- Constructor
  constructor() {
    // Redirect to dashboard of already authenticated
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
