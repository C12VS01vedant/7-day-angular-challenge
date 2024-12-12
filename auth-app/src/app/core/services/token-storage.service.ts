import { Injectable, PLATFORM_ID, inject,signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private TOKEN_KEY = 'auth-token';
  private USER_KEY = 'auth-user';
  private platformId = inject(PLATFORM_ID);

  private isAuthenticatedSignal = signal<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  constructor() {
    if (this.isBrowser()) {
      this.isAuthenticatedSignal.set(!!this.getToken());
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getLocalStorage(): Storage | null {
    return this.isBrowser() ? localStorage : null;
  }

  saveToken(token: string): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem(this.TOKEN_KEY, token);
      this.isAuthenticatedSignal.set(true);
    }
  }

  getToken(): string | null {
    const storage = this.getLocalStorage();
    return storage ? storage.getItem(this.TOKEN_KEY) : null;
  }

  saveUser(user: User): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): User | null {
    const storage = this.getLocalStorage();
    if (storage) {
      const userString = storage.getItem(this.USER_KEY);
      return userString ? JSON.parse(userString) : null;
    }
    return null;
  }

  signOut(): void {
    const storage = this.getLocalStorage();
    if (storage) {
      storage.removeItem(this.TOKEN_KEY);
      storage.removeItem(this.USER_KEY);
      this.isAuthenticatedSignal.set(false);
    }
  }
}
