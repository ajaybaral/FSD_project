import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  testData: any = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTestData();
  }

  loadTestData(): void {
    this.loading = true;
    this.error = null;
    
    this.http.get(`${environment.apiUrl}/test`).subscribe({
      next: (data) => {
        this.testData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load test data. Please try again later.';
        this.loading = false;
        console.error('Error loading test data:', err);
      }
    });
  }
} 