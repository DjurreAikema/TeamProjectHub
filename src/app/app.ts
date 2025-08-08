import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from './features/auth/data-access/auth.service';
import {NavbarComponent} from "./shared/components/navbar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  template: `
<!--      <div class="main-grid">-->
          <!--Navbar-->
          <app-navbar class="navbar"/>

          <!--Content-->
          <router-outlet class="content"/>
<!--      </div>-->
  `,
  styles: [`
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: 70px minmax(0, 1fr);
      gap: 0 0;
      grid-template-areas: 
        "navbar"
        "content";
      
      width: 100%;
      height: 100dvh;
      
      overflow: hidden;
    }

    .navbar {
      grid-area: navbar;
    }

    .content {
      grid-area: content;

      width: 100%;
      height: 100%;
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
