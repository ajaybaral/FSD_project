import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'social-media-app';
  isAuthenticated = false;
  username = '';

  constructor(private route: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    console.log('🚀 App Component Initialized');
    console.log('Current URL:', window.location.href);
    console.log('Current search params:', window.location.search);

    // First, check URL parameters directly from window.location
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const username = urlParams.get('username');

    console.log('URL Parameters:', { token, username });

    if (token && username) {
      console.log('✅ Authentication detected from URL parameters');

      // Store authentication info
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
      this.isAuthenticated = true;
      this.username = username;

      console.log('✅ Authentication stored and state updated');

      // Clean URL and navigate to landing page first
      this.router.navigate(['/'], { replaceUrl: true }).then(() => {
        console.log('✅ Navigated to landing page');
      });

      // Show welcome message
      setTimeout(() => {
        alert(
          `Welcome ${username}! You are now authenticated and can participate in events.`
        );
      }, 1000);
    } else {
      // Check if already authenticated from localStorage
      const storedToken = localStorage.getItem('authToken');
      const storedUsername = localStorage.getItem('username');

      console.log('Stored auth check:', { storedToken, storedUsername });

      if (storedToken && storedUsername) {
        console.log('✅ Found stored authentication');
        this.isAuthenticated = true;
        this.username = storedUsername;

        console.log('✅ User is authenticated, showing authenticated content');
      } else {
        console.log('❌ No authentication found, showing auth required screen');
      }
    }

    // Also subscribe to route changes to handle navigation
    this.route.queryParams.subscribe((params) => {
      console.log('Route params changed:', params);
      // This handles any subsequent parameter changes
      if (params['token'] && params['username'] && !this.isAuthenticated) {
        console.log('✅ Authentication detected from route params');
        localStorage.setItem('authToken', params['token']);
        localStorage.setItem('username', params['username']);
        this.isAuthenticated = true;
        this.username = params['username'];
        this.router.navigate(['/'], { replaceUrl: true });
      }
    });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.isAuthenticated = false;
    this.username = '';

    // Redirect to registration service
    window.location.href = 'http://localhost:4200';
  }

  goToRegistration(): void {
    window.location.href = 'http://localhost:4200';
  }
}
