import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {UserModel} from '../../../core/models';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

interface AuthState {
  user: UserModel | null | undefined;
  error: string | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // --- Dependencies
  private router: Router = inject(Router);

  // --- State
  private state: WritableSignal<AuthState> = signal<AuthState>({
    user: undefined,
    error: null,
    isLoading: false
  });

  // --- Selectors
  user: Signal<UserModel | null | undefined> = computed(() => this.state().user);
  error: Signal<string | null> = computed(() => this.state().error);
  isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  isAuthenticated: Signal<boolean> = computed(() => !!this.state().user);

  // --- sources
  login$: Subject<void> = new Subject<void>();
  logout$: Subject<void> = new Subject<void>();
  error$: Subject<string> = new Subject<string>();


}
