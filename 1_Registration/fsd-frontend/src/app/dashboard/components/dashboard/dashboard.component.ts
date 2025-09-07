import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthService,
  DashboardResponse,
} from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardResponse | null = null;
  loading = true;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    this.authService.getDashboard().subscribe({
      next: (response) => {
        console.log('Dashboard data:', response);
        this.dashboardData = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Dashboard error:', error);
        this.error = error.message || 'Failed to load dashboard';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToParticipation(): void {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');

    if (token && username) {
      // Redirect to participation service with authentication info
      window.location.href = `http://localhost:4201?token=${token}&username=${username}`;
    } else {
      alert('Authentication token not found. Please login again.');
    }
  }

  viewProfile(): void {
    // Navigate to profile page (implement as needed)
    alert('Profile functionality coming soon!');
  }

  manageEvents(): void {
    // Navigate to event management page (implement as needed)
    alert('Event management functionality coming soon!');
  }
}
