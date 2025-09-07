import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  LoginRequest,
  LoginResponse,
  DashboardResponse,
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    const loginData: LoginRequest = { email, password };

    this.authService.login(loginData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login successful', response);
        this.isSubmitting = false;

        // Store token and user info for cross-service communication
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRole', response.role);

        // Get user dashboard data to retrieve username
        this.authService.getDashboard().subscribe({
          next: (dashboardData) => {
            localStorage.setItem('username', dashboardData.username);

            // Show success message
            alert(
              `Login successful! Welcome ${dashboardData.username}! Redirecting to participation form...`
            );

            // Automatically redirect to participation service with token
            setTimeout(() => {
              window.location.href = `http://localhost:4201?token=${response.token}&username=${dashboardData.username}`;
            }, 1000);
          },
          error: (dashboardError) => {
            console.error('Error getting dashboard data:', dashboardError);
            // Fallback - redirect without username
            alert('Login successful! Redirecting to participation form...');
            setTimeout(() => {
              window.location.href = `http://localhost:4201?token=${response.token}&username=user`;
            }, 1000);
          },
        });
      },
      error: (error: Error) => {
        console.error('Login error:', error);
        this.isSubmitting = false;
        this.errorMessage =
          error.message || 'Login failed. Please try again later.';
      },
    });
  }

  // Helper methods for template
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
