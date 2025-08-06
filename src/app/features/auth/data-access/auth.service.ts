import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {UserModel} from '../../../core/models';
import {Router} from '@angular/router';
import {catchError, EMPTY, map, merge, Observable, of, Subject, switchMap, tap} from 'rxjs';
import {connect} from "ngxtension/connect";

// Import user data
import usersData from '../../../data/users.json';

interface AuthState {
  user: UserModel | null | undefined;
  error: string | null;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'tpmh_auth_user';

  // --- Dependencies
  private router: Router = inject(Router);

  // --- State
  private state: WritableSignal<AuthState> = signal<AuthState>({
    user: this.loadUserFromStorage(),
    isLoading: false,
    error: null,
  });

  // --- Selectors
  user: Signal<UserModel | null | undefined> = computed(() => this.state().user);
  error: Signal<string | null> = computed(() => this.state().error);
  isLoading: Signal<boolean> = computed(() => this.state().isLoading);
  isAuthenticated: Signal<boolean> = computed(() => !!this.state().user);

  // --- sources
  login$: Subject<string> = new Subject<string>();
  logout$: Subject<void> = new Subject<void>();
  error$: Subject<string> = new Subject<string>();

  private loginAttempt$ = this.login$.pipe(
    switchMap((userId) => this.performLogin(userId)),
    catchError((error) => {
      this.error$.next(error.message || 'Login failed');
      return EMPTY;
    })
  );

  // --- Reducers
  constructor() {
    const nextState$ = merge(
      // login$ reducer - set loading state
      this.login$.pipe(map(() => ({isLoading: true, error: null}))),

      // loginAttempt$ reducer - successful login
      this.loginAttempt$.pipe(
        map((user) => ({
          user: user,
          isLoading: false,
          error: null
        })),
        tap(() => this.router.navigate(['/dashboard']))
      ),

      // logout$ reducer
      this.logout$.pipe(
        map(() => ({
          user: null,
          isLoading: false,
          error: null
        })),
        tap(() => {
          localStorage.removeItem(this.STORAGE_KEY);
          this.router.navigate(['/auth/login']);
        })
      ),

      // error$ reducer
      this.error$.pipe(map((error) => ({
        isLoading: false,
        error: error
      })))
    );

    connect(this.state)
      .with(nextState$);
  }

  // --- Public methods
  getLoginUsers(): UserModel[] {
    const users = usersData as UserModel[];

    // Get first user of each role
    const admin = users.find(u => u.role === 'admin');
    const pm = users.find(u => u.role === 'pm');
    const developer = users.find(u => u.role === 'developer');
    const viewer = users.find(u => u.role === 'viewer');

    return [admin, pm, developer, viewer]
      .filter((user): user is UserModel => !!user);
  }

  login(userId: string): void {
    this.login$.next(userId);
  }

  logout(): void {
    this.logout$.next();
  }

  // --- Private methods
  private performLogin(userId: string): Observable<UserModel> {
    const users = usersData as UserModel[];
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return of(user);
  }

  private loadUserFromStorage(): UserModel | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
