import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface User {
  userId: number;
  name: string;
  clgName: string;
  email: string;
  phoneNo: string;
  roles: string;
  date: string;
}

export interface AuthResponse {
  valid: boolean;
  user?: User;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthIntegrationService {
  private readonly REGISTRATION_API_URL = 'http://localhost:8081/api';
  private readonly PARTICIPATION_API_URL = 'http://localhost:8082/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already authenticated on service initialization
    this.checkAuthenticationStatus();
  }

  /**
   * Validate token with registration service
   */
  validateToken(token: string): Observable<AuthResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<AuthResponse>(
        `${this.PARTICIPATION_API_URL}/auth/validate`,
        { token },
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.valid && response.user) {
            this.currentUserSubject.next(response.user);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
          }
          return response;
        }),
        catchError((error) => {
          console.error('Token validation failed:', error);
          return of({ valid: false, error: 'Token validation failed' });
        })
      );
  }

  /**
   * Login through registration service
   */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.REGISTRATION_API_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((response: any) => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('userRole', response.role);

            // Validate token with participation service
            this.validateToken(response.token).subscribe();
          }
          return response;
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const token = localStorage.getItem('authToken');

    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');

    this.currentUserSubject.next(null);

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return this.http.post(
        `${this.REGISTRATION_API_URL}/auth/logout`,
        {},
        { headers }
      );
    }

    return of({ message: 'Logged out successfully' });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get auth token
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Check authentication status on service initialization
   */
  private checkAuthenticationStatus(): void {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);

        // Validate token is still valid
        this.validateToken(token).subscribe((response) => {
          if (!response.valid) {
            this.logout().subscribe();
          }
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout().subscribe();
      }
    }
  }

  /**
   * Redirect to registration service for login
   */
  redirectToLogin(): void {
    window.location.href = 'http://localhost:4200/login';
  }
}
