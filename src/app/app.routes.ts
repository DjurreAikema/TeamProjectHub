import {Routes} from '@angular/router';
import {authGuard, hasRole} from './core/guards';

export const routes: Routes = [
  // Auth routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes)
  },

  // Protected dashboard route
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component')
  },

  // Example of role-protected route (admin only)
  {
    path: 'admin',
    canActivate: [authGuard, hasRole(['admin'])],
    loadComponent: () => import('./features/dashboard/dashboard.component') // TODO Replace with actual admin component
  },

  // Default redirects
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Fallback route
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
