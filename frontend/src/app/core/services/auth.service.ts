import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginPayload, LoginResponse, StoredUserProfile } from '../models/auth.models';
import { decodeJwt } from '../utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'rbas_token';
  private readonly profileKey = 'rbas_profile';
  private readonly authUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.authUrl}/login`, payload)
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.data.token);
          localStorage.setItem(this.profileKey, JSON.stringify(response.data.user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.profileKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getDecodedToken() {
    const token = this.getToken();
    return token ? decodeJwt(token) : null;
  }

  getRole(): string | null {
    return this.getDecodedToken()?.role ?? null;
  }

  getUserId(): number | null {
    return this.getDecodedToken()?.id ?? null;
  }

  getUserName(): string {
    const rawProfile = localStorage.getItem(this.profileKey);

    if (!rawProfile) {
      return 'there';
    }

    try {
      return (JSON.parse(rawProfile) as StoredUserProfile).name || 'there';
    } catch {
      return 'there';
    }
  }

  getStoredUserId(): number | null {
    const rawProfile = localStorage.getItem(this.profileKey);

    if (!rawProfile) {
      return null;
    }

    try {
      return (JSON.parse(rawProfile) as StoredUserProfile).id ?? null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const payload = this.getDecodedToken();

    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 > Date.now();
  }

  getDashboardRoute(): string {
    switch (this.getRole()) {
      case 'admin':
        return '/admin-dashboard';
      case 'analyst':
        return '/analyst-dashboard';
      case 'employee':
        return '/employee-dashboard';
      default:
        return '/login';
    }
  }
}
