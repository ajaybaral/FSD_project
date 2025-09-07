import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  throwError,
  tap,
  catchError,
  retry,
} from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private apiUrl = 'http://localhost:8080';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadUser();
    console.log('AuthService initialized with API URL:', this.apiUrl);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);

    if (error.status === 0) {
      console.error('Network error details:', {
        message: error.message,
        name: error.name,
        error: error.error,
      });
      return throwError(
        () => new Error('Network error - please check your connection')
      );
    }

    if (error.status === 404) {
      return throwError(() => new Error('API endpoint not found'));
    }

    const errorMessage = error.error?.message || error.error || 'Server error';
    return throwError(() => new Error(errorMessage));
  }

  loadUser(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => this.userSubject.next(user),
        error: () => {
          this.tokenService.removeToken();
          this.userSubject.next(null);
        },
      });
    }
  }

  getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/me`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  login(username: string, password: string): Observable<{ token: string; user: User }> {
    console.log('Sending login request with username:', username, 'and password:', password);
    return this.http
      .post<{ token: string; user: User }>(`${this.apiUrl}/register/login`, { username, password }, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log('Login success response:', response);
          this.tokenService.saveToken(response.token);
          this.userSubject.next(response.user);
        }),
        catchError(this.handleError.bind(this))
      );
}


  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ token: string; user: User }> {
    console.log('Register request to:', `${this.apiUrl}/register`);
    return this.http
      .post<{ token: string; user: User }>(
        `${this.apiUrl}/register`,
        { name, email, password },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        retry(1),
        tap((response) => {
          console.log('Register success response:', response);
          this.tokenService.saveToken(response.token);
          this.userSubject.next(response.user);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.getToken() !== null;
  }

  getParticipatedEvents(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/user/${username}/participated-events`)
      .pipe(catchError(this.handleError.bind(this)));
  }
  
}
