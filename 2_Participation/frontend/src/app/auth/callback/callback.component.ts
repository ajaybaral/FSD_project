import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthIntegrationService } from '../../services/auth-integration.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <div class="spinner" *ngIf="isProcessing"></div>
        <h2 *ngIf="isProcessing">Processing Authentication...</h2>
        <div *ngIf="!isProcessing && error" class="error-message">
          <h2>Authentication Failed</h2>
          <p>{{ error }}</p>
          <button class="btn btn-primary" (click)="redirectToLogin()">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .callback-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .callback-card {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 400px;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      h2 {
        color: #333;
        margin-bottom: 20px;
      }

      .error-message {
        color: #dc3545;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 20px;
      }

      .btn-primary {
        background: #667eea;
        color: white;
      }

      .btn-primary:hover {
        background: #5a6fd8;
      }
    `,
  ],
})
export class AuthCallbackComponent implements OnInit {
  isProcessing = true;
  error: string | null = null;

  constructor(
    private authService: AuthIntegrationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const error = params['error'];

      if (error) {
        this.isProcessing = false;
        this.error = error;
        return;
      }

      if (token) {
        this.processToken(token);
      } else {
        this.isProcessing = false;
        this.error = 'No authentication token received';
      }
    });
  }

  private processToken(token: string): void {
    // Store the token
    localStorage.setItem('authToken', token);

    // Validate token with participation service
    this.authService.validateToken(token).subscribe({
      next: (response) => {
        this.isProcessing = false;
        if (response.valid) {
          // Redirect to dashboard or intended page
          const intendedUrl =
            localStorage.getItem('intendedUrl') || '/dashboard';
          localStorage.removeItem('intendedUrl');
          this.router.navigate([intendedUrl]);
        } else {
          this.error = response.error || 'Token validation failed';
        }
      },
      error: (err) => {
        this.isProcessing = false;
        this.error = 'Failed to validate authentication token';
        console.error('Token validation error:', err);
      },
    });
  }

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
