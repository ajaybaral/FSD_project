import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthIntegrationService } from '../../services/auth-integration.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Authentication Required</h2>
        <p>
          You need to login through the registration service to access
          participation features.
        </p>

        <div class="login-actions">
          <button class="btn btn-primary" (click)="redirectToLogin()">
            Go to Login
          </button>
          <button
            class="btn btn-secondary"
            (click)="checkToken()"
            *ngIf="hasToken"
          >
            Verify Existing Session
          </button>
        </div>

        <div class="info-section">
          <h3>New User?</h3>
          <p>If you don't have an account, please register first:</p>
          <button class="btn btn-outline" (click)="redirectToRegister()">
            Register New Account
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
      }

      .login-card {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 500px;
        width: 100%;
      }

      h2 {
        color: #333;
        margin-bottom: 20px;
      }

      p {
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .login-actions {
        margin-bottom: 40px;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin: 10px;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: #667eea;
        color: white;
      }

      .btn-primary:hover {
        background: #5a6fd8;
      }

      .btn-secondary {
        background: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background: #5a6268;
      }

      .btn-outline {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
      }

      .btn-outline:hover {
        background: #667eea;
        color: white;
      }

      .info-section {
        border-top: 1px solid #eee;
        padding-top: 30px;
      }

      h3 {
        color: #333;
        margin-bottom: 15px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  hasToken = false;

  constructor(
    private authService: AuthIntegrationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hasToken = !!this.authService.getAuthToken();

    // Check if there's a token in URL parameters (from registration service redirect)
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        localStorage.setItem('authToken', params['token']);
        this.validateTokenAndRedirect(params['token']);
      }
    });
  }

  redirectToLogin(): void {
    // Redirect to registration service login with return URL
    const returnUrl = encodeURIComponent(
      window.location.origin + '/auth/callback'
    );
    window.location.href = `http://localhost:4200/login?returnUrl=${returnUrl}`;
  }

  redirectToRegister(): void {
    // Redirect to registration service register page
    window.location.href = 'http://localhost:4200/register';
  }

  checkToken(): void {
    const token = this.authService.getAuthToken();
    if (token) {
      this.validateTokenAndRedirect(token);
    }
  }

  private validateTokenAndRedirect(token: string): void {
    this.authService.validateToken(token).subscribe((response) => {
      if (response.valid) {
        // Token is valid, redirect to dashboard or intended page
        this.router.navigate(['/dashboard']);
      } else {
        // Token is invalid, clear it and show login options
        localStorage.removeItem('authToken');
        this.hasToken = false;
        alert('Your session has expired. Please login again.');
      }
    });
  }
}
