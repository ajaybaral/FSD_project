import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="success-container">
      <div class="success-card">
        <div class="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="64"
            height="64"
          >
            <circle cx="12" cy="12" r="11" fill="#4CAF50" />
            <path
              d="M10.5,16.5l-4-4l1.4-1.4l2.6,2.6l6.6-6.6l1.4,1.4L10.5,16.5z"
              fill="white"
            />
          </svg>
        </div>
        <h2 class="success-title">Registration Successful!</h2>
        <p class="success-message">
          Your participant registration has been completed successfully.
        </p>
        <p class="success-details">
          Thank you for registering for the event.
        </p>
        <div class="action-buttons">
          <button routerLink="/dashboard" class="btn btn-primary">
            Back to Dashboard
          </button>
          <button routerLink="/form" class="btn btn-primary">
            Register Another
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .success-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 2rem;
      }

      .success-card {
        background: white;
        padding: 2.5rem;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        text-align: center;
        max-width: 500px;
        width: 100%;
        position: relative;
        overflow: hidden;
        animation: fadeIn 0.5s ease;
      }

      .success-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 6px;
        background: linear-gradient(to right, #4caf50, #8bc34a);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .success-icon {
        margin: 0 auto 1.5rem;
        animation: scaleIn 0.5s ease 0.2s both;
      }

      @keyframes scaleIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }

      .success-title {
        color: #2e7d32;
        margin-bottom: 1rem;
        font-weight: 600;
        animation: slideUp 0.5s ease 0.3s both;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .success-message {
        font-size: 1.2rem;
        margin-bottom: 1rem;
        color: #333;
        animation: slideUp 0.5s ease 0.4s both;
      }

      .success-details {
        color: #666;
        margin-bottom: 2rem;
        animation: slideUp 0.5s ease 0.5s both;
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        animation: slideUp 0.5s ease 0.6s both;
      }

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .btn-primary {
        background-color: #2e7d32;
        color: white;
      }

      .btn-primary:hover {
        background-color: #1b5e20;
      }

      .btn-secondary {
        background-color: #f5f5f5;
        color: #333;
      }

      .btn-secondary:hover {
        background-color: #e0e0e0;
      }

      @media (max-width: 576px) {
        .action-buttons {
          flex-direction: column;
          gap: 0.8rem;
        }

        .success-card {
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class SuccessComponent {}
