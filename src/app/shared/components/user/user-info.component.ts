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
  styles: ``
})
export class UserInfoComponent {

  // --- Inputs
  user = input.required<UserModel | null | undefined>();

}
