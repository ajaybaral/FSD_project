import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class LandingComponent implements OnInit {
  username = '';
  isAuthenticated = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check authentication status
    const storedUsername = localStorage.getItem('username');
    const storedToken = localStorage.getItem('authToken');

    if (storedUsername && storedToken) {
      this.username = storedUsername;
      this.isAuthenticated = true;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToForm() {
    this.router.navigate(['/form']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticated = false;
    this.username = '';

    // Redirect to registration service
    window.location.href = 'http://localhost:4200';
  }
}
