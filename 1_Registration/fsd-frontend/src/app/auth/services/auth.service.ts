import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

// Interfaces for request/response types
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  clg_name: string;
  phone_no: string;
  roles: string;
}

export interface SignupResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  role: string;
}

export interface DashboardResponse {
  message: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private tokenKey = 'auth_token';
  private userRoleKey = 'user_role';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  private authState = new BehaviorSubject<boolean>(false);
  private userData = new BehaviorSubject<{
    email: string;
    username: string;
  } | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // Initialize auth state from localStorage
    this.authState.next(this.isLoggedIn());
    if (this.isLoggedIn()) {
      this.getDashboard().subscribe();
    }
  }

  // Get auth state as observable
  get isAuthenticated$() {
    return this.authState.asObservable();
  }

  // Get user data as observable
  get userData$() {
    return this.userData.asObservable();
  }

  // Signup new user
  signup(data: SignupRequest): Observable<SignupResponse> {
    console.log('Sending signup request:', data);

    // FOR TESTING: Store user data locally instead of calling backend
    // TODO: Replace with actual backend call when PostgreSQL is ready
    // return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, data, { headers: this.getHeaders() })

    return new Observable<SignupResponse>((observer) => {
      try {
        // Get existing users from localStorage
        const existingUsers = JSON.parse(
          localStorage.getItem('registeredUsers') || '[]'
        );

        // Check if user already exists
        const userExists = existingUsers.find(
          (user: any) => user.email === data.email
        );
        if (userExists) {
          observer.error(new Error('User with this email already exists'));
          return;
        }

        // Add new user to local storage
        const newUser = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          password: data.password, // In real app, this would be hashed
          clg_name: data.clg_name,
          phone_no: data.phone_no,
          roles: data.roles,
          createdAt: new Date().toISOString(),
        };

        existingUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

        console.log('User registered locally:', newUser);

        // Simulate API response
        const response: SignupResponse = {
          message: 'User registered successfully',
        };
        observer.next(response);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Registration failed'));
      }
    }).pipe(
      tap((response: SignupResponse) =>
        console.log('Signup response:', response)
      ),
      catchError(this.handleError.bind(this))
    );
  }

  // Login user
  login(data: LoginRequest): Observable<LoginResponse> {
    console.log('Sending login request:', data);

    // FOR TESTING: Check credentials against local storage instead of backend
    // TODO: Replace with actual backend call when PostgreSQL is ready
    // return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data, { headers: this.getHeaders() })

    return new Observable<LoginResponse>((observer) => {
      try {
        // Get registered users from localStorage
        const registeredUsers = JSON.parse(
          localStorage.getItem('registeredUsers') || '[]'
        );

        // Find user with matching credentials
        const user = registeredUsers.find(
          (u: any) => u.email === data.email && u.password === data.password
        );

        if (!user) {
          observer.error(new Error('Invalid email or password'));
          return;
        }

        // Generate a mock JWT token
        const mockToken = `mock-jwt-${Date.now()}-${user.id}`;

        // Simulate API response
        const response: LoginResponse = {
          message: 'Login successful',
          token: mockToken,
          role: user.roles,
        };

        console.log('Login successful for user:', user.name);

        // Store auth data
        this.setToken(response.token);
        this.setUserRole(response.role);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.isAuthenticatedSubject.next(true);

        observer.next(response);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Login failed'));
      }
    }).pipe(
      tap((response: LoginResponse) => {
        if (!response?.token || !response?.role) {
          throw new Error('Invalid response from server');
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  // Get dashboard data
  getDashboard(): Observable<DashboardResponse> {
    const role = localStorage.getItem(this.userRoleKey);
    if (!role) {
      return throwError(() => new Error('No role found'));
    }

    // FOR TESTING: Get user data from local storage instead of backend
    // TODO: Replace with actual backend call when PostgreSQL is ready
    // const endpoint = role.toLowerCase().replace('_', '-');
    // return this.http.get<DashboardResponse>(`${this.apiUrl}/roles/${endpoint}`, { headers: this.getAuthHeaders() })

    return new Observable<DashboardResponse>((observer) => {
      try {
        const currentUser = JSON.parse(
          localStorage.getItem('currentUser') || '{}'
        );

        if (!currentUser.name) {
          observer.error(new Error('No user data found'));
          return;
        }

        const response: DashboardResponse = {
          message: 'Dashboard data retrieved successfully',
          username: currentUser.name,
          role: currentUser.roles,
        };

        this.userData.next({
          email: currentUser.email,
          username: currentUser.name,
        });

        observer.next(response);
        observer.complete();
      } catch (error) {
        observer.error(new Error('Failed to get dashboard data'));
      }
    }).pipe(catchError(this.handleError.bind(this)));
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.authState.next(false);
    this.userData.next(null);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  // Get current JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Private helper methods
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUserRole(role: string): void {
    localStorage.setItem(this.userRoleKey, role);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private redirectToDashboard(role: string): void {
    const roleLower = role.toLowerCase();
    switch (roleLower) {
      case 'user':
        this.router.navigate(['/dashboard/user']);
        break;
      case 'task_manager':
        this.router.navigate(['/dashboard/task-manager']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request data';
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 403) {
        errorMessage = 'Access denied';
      } else {
        errorMessage =
          error.error?.message ||
          `Error: ${error.status} - ${error.statusText}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
