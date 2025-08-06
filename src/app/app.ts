import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './features/auth/data-access/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <router-outlet/>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100dvh;
    }
  `],
})
export class App implements OnInit {
  // --- Dependencies
  private authService = inject(AuthService);
  private router = inject(Router);

  // --- Methods
  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
