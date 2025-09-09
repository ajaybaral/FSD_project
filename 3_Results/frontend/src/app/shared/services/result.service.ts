import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Result } from '../models/result.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = `${environment.apiUrl}/results`;

  constructor(private http: HttpClient) { }

  getResults(): Observable<Result[]> {
    return this.http.get<Result[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getResult(id: string): Observable<Result> {
    return this.http.get<Result>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createResult(result: Result): Observable<Result> {
    return this.http.post<Result>(this.apiUrl, result)
      .pipe(catchError(this.handleError));
  }

  updateResult(id: string, result: Result): Observable<Result> {
    return this.http.put<Result>(`${this.apiUrl}/${id}`, result)
      .pipe(catchError(this.handleError));
  }

  deleteResult(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error('Result Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
} 