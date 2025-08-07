import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserModel} from '../../../core/models';
import {LoginUserCardComponent} from "./login-user-card.component";

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [CommonModule, LoginUserCardComponent],
  template: `
      <div class="login-overlay">
          <div class="login-dialog">

              <div class="dialog-header">
                  <h2>Welcome to Team Project Management Hub</h2>
                  <p>Select a user to login as:</p>
              </div>

              <div class="user-cards">
                  @for (user of quickLoginUsers(); track user.id) {
                      <app-login-user-card
                              [isLoading]="isLoading()"
                              [user]="user"
                              (loginWithUserId)="loginWithUserId.emit($event)"
                      />
                  }
              </div>

              @if (authError()) {
                  <div class="error-message">
                      {{ authError() }}
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

    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #ffcdd2;
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

  // --- Inputs
  isLoading = input.required<boolean>();
  quickLoginUsers = input.required<UserModel[]>();

  authError = input<string | null>();

  // --- Outputs
  loginWithUserId = output<string>();

}
