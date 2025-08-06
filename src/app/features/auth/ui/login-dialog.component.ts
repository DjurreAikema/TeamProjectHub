import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthService} from '../data-access/auth.service';
import {UserModel} from '../../../core/models';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-overlay">
      <div class="login-dialog">

        <div class="dialog-header">
          <h2>Welcome to Team Project Management Hub</h2>
          <p>Select a user to login as:</p>
        </div>

        <div class="user-cards">
          @for (user of loginUsers(); track user.id) {
            <div class="user-card"
                 [class.loading]="authService.isLoading() && selectedUserId() === user.id"
                 (click)="selectUser(user.id)">

              <div class="user-avatar">
                <img [src]="user.avatar" [alt]="user.name + ' avatar'"/>
              </div>

              <div class="user-info">
                <h3>{{ user.name }}</h3>
                <p class="user-role">{{ getRoleDisplay(user.role) }}</p>
                <p class="user-email">{{ user.email }}</p>
              </div>

              @if (authService.isLoading() && selectedUserId() === user.id) {
                .loading-spinner();
              }
            </div>
          }
        </div>

        @if (authService.error()) {
          <div class="error-message">
            {{ authService.error() }}
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .login-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .login-dialog {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 600px;
      width: 90vw;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .dialog-header h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 1.5rem;
    }

    .dialog-header p {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    .user-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .user-card {
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      position: relative;
      background: #fafafa;
    }

    .user-card:hover {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
    }

    .user-card.loading {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .user-avatar {
      margin-bottom: 1rem;
    }

    .user-avatar img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #e0e0e0;
    }

    .user-info h3 {
      margin: 0 0 0.25rem 0;
      color: #333;
      font-size: 1.1rem;
      font-weight: 600;
    }

    .user-role {
      margin: 0 0 0.5rem 0;
      color: #667eea;
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-email {
      margin: 0;
      color: #666;
      font-size: 0.85rem;
    }

    .loading-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      border: 2px solid #e0e0e0;
      border-top: 2px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #ffcdd2;
    }

    @keyframes spin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }

    @media (max-width: 600px) {
      .user-cards {
        grid-template-columns: 1fr;
      }

      .login-dialog {
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginDialogComponent {
  // --- Dependencies
  authService = inject(AuthService);

  // --- Properties
  loginUsers = signal<UserModel[]>([]);
  selectedUserId = signal<string | null>(null);

  // --- Constructor
  constructor() {
    this.loginUsers.set(this.authService.getLoginUsers());
  }

  // --- Methods
  selectUser(userId: string): void {
    if (this.authService.isLoading()) return;

    this.selectedUserId.set(userId);
    this.authService.login(userId);
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
