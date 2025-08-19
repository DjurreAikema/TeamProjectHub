import {Component, input} from '@angular/core';
import {UserModel} from "@core/models";

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [],
  template: `
      <div class="user-info">
          <img [src]="user()?.avatar" [alt]="user()?.name + ' avatar'" class="user-avatar"/>
          <span class="user-name">{{ user()?.name }}</span>
      </div>
  `,
  styles: [`
    .user-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #e0e0e0;
    }

    .user-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
      white-space: nowrap; /* Prevent text wrapping */
    }
  `]
})
export class UserInfoComponent {

  // --- Inputs
  user = input.required<UserModel | null | undefined>();

}
