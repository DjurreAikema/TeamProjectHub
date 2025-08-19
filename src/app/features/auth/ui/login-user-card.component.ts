import {Component, input, output} from '@angular/core';
import {UserModel} from "@core/models";
import {convertUserRoleToDescriptiveName} from '../helpers/index';

@Component({
  selector: 'app-login-user-card',
  standalone: true,
  imports: [],
  template: `
      <div class="user-card"
           [class.loading]="isLoading()"
           (click)="loginWithUserId.emit(user().id)">

          <div class="user-avatar">
              <img [src]="user().avatar" [alt]="user().name + ' avatar'"/>
          </div>

          <div class="user-info">
              <h3>{{ user().name }}</h3>
              <p class="user-role">{{ convertUserRoleToDescriptiveName(user().role) }}</p>
              <p class="user-email">{{ user().email }}</p>
          </div>

          @if (isLoading()) {
              .loading-spinner();
          }
      </div>
  `,
  styles: [`
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

    @keyframes spin {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
  `]
})
export class LoginUserCardComponent {

  // --- Inputs
  isLoading = input.required<boolean>();
  user = input.required<UserModel>();

  // --- Outputs
  loginWithUserId = output<string>();

  // --- Helpers
  protected readonly convertUserRoleToDescriptiveName = convertUserRoleToDescriptiveName;

}
