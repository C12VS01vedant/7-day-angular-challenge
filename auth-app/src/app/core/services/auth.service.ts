import { observable } from '../../../../node_modules/rxjs/src/internal/symbol/observable';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthResponse } from '../../shared/interfaces/auth-response.interface';
import { User } from '../../shared/models/user.model';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenStorageService);

  private users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      roles: ['ADMIN'],
    },
    {
      id: 2,
      username: 'user',
      email: 'user@example.com',
      roles: ['USER'],
    },
  ];

  login(credentials: {
    username: string;
    password: string;
  }): Observable<AuthResponse> {
    const user = this.users.find((u) => u.username === credentials.username);
    if (user && credentials.password === '12345') {
      const token = this.generateMockJwt(user);
      return of({
        token: token,
        user: user,
      });
    }
    return throwError(() => new Error('Invalid credentials'));
  }

  private generateMockJwt(user: User): string {
    const header = btoa(JSON.stringify({ alg: `HS256`, typ: `JWT` }));
    const payload = btoa(
      JSON.stringify({
        sub: user.id.toString(),
        username: user.username,
        roles: user.roles,
        exp: Date.now() + 3600000,
      })
    );
    const signature = btoa('mock-signature');

    return `${header}.${payload}.${signature}`;
  }

  validateToken(token: string): boolean {
    try {
      const [header, payload, signature] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));

      return decodedPayload.exp > Date.now();
    } catch (error) {
      return false;
    }
  }
}
