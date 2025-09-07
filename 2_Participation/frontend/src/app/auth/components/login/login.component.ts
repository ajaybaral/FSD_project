import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { NgIf, NgClass, CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, NgIf, NgClass]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService  // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      // Use AuthService to call the backend login endpoint
      this.authService.login(username, password).subscribe({
        next: (response) => {
          // On success, store the user token and data in localStorage
          localStorage.setItem('username', username);
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', response.user.name);
          localStorage.setItem('token', response.token); // Store token

          // Navigate to the dashboard
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          // Handle error, for example, if invalid credentials
          this.errorMessage = err.message || 'Invalid username or password. Please try again.';
          this.isSubmitting = false;
        },
      });
    }
  }
}
