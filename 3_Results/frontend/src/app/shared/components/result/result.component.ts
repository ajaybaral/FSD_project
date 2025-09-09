import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Result } from '../../models/result.model';
import { ResultService } from '../../services/result.service';
import { 
  FormBuilder, 
  FormGroup, 
  FormControl,
  ReactiveFormsModule, 
  Validators, 
  FormsModule 
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="container">
      <!-- Header Section -->
      <div class="header-section">
        <h1>Results</h1>
        <button 
          (click)="toggleForm()"
          class="add-button"
        >
          <i class="fas" [class.fa-plus]="!showForm" [class.fa-times]="showForm"></i>
          <span>{{!showForm ? 'Add Result' : 'Close Form'}}</span>
        </button>
      </div>

      <!-- Messages -->
      <div *ngIf="errorMessage" class="message error">
        <span>{{ errorMessage }}</span>
        <button (click)="errorMessage = null">&times;</button>
      </div>
      
      <div *ngIf="successMessage" class="message success">
        <span>{{ successMessage }}</span>
        <button (click)="successMessage = null">&times;</button>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>

      <!-- Add/Edit Result Form -->
      <div *ngIf="showForm" class="form-section">
        <h2>{{editingResult ? 'Edit' : 'Add New'}} Result</h2>
        <form [formGroup]="resultForm" (ngSubmit)="onSubmit()" class="form-grid">
          <div class="form-group">
            <label>Name</label>
            <input 
              type="text" 
              formControlName="name"
              [class.invalid]="isInvalid('name')"
            >
            <div *ngIf="isInvalid('name')" class="error-message">
              Name is required
            </div>
          </div>
          <div class="form-group">
            <label>Position</label>
            <input 
              type="text" 
              formControlName="position"
              [class.invalid]="isInvalid('position')"
            >
            <div *ngIf="isInvalid('position')" class="error-message">
              Position is required
            </div>
          </div>
          <div class="form-group">
            <label>Winning Amount</label>
            <input 
              type="number" 
              formControlName="winningAmount"
              [class.invalid]="isInvalid('winningAmount')"
            >
            <div *ngIf="isInvalid('winningAmount')" class="error-message">
              Winning amount must be greater than 0
            </div>
          </div>
          <div class="form-group">
            <label>Event ID</label>
            <input 
              type="text" 
              formControlName="eventId"
              [class.invalid]="isInvalid('eventId')"
            >
            <div *ngIf="isInvalid('eventId')" class="error-message">
              Event ID is required
            </div>
          </div>
          <div class="form-group">
            <label>Player ID</label>
            <input 
              type="text" 
              formControlName="pId"
              [class.invalid]="isInvalid('pId')"
            >
            <div *ngIf="isInvalid('pId')" class="error-message">
              Player ID is required
            </div>
          </div>
          <div class="form-group md:col-span-2">
            <button 
              type="submit"
              [disabled]="resultForm.invalid || loading"
              class="submit-button"
            >
              {{editingResult ? 'Update' : 'Add'}} Result
            </button>
          </div>
        </form>
      </div>

      <!-- Search Section -->
      <div class="search-section">
        <input 
          type="text" 
          [formControl]="searchControl"
          (input)="filterResults()"
          placeholder="Search by name..." 
        >
      </div>

      <!-- Results Table -->
      <div *ngIf="!loading" class="table-section">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Winning Amount</th>
              <th>Event ID</th>
              <th>Player ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let result of filteredResults">
              <td>{{result.name}}</td>
              <td>{{result.position}}</td>
              <td>₹{{result.winningAmount}}</td>
              <td>{{result.eventId}}</td>
              <td>{{result.pId}}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    (click)="editResult(result)"
                    class="edit-button"
                  >
                    <i class="fas fa-edit"></i> Edit
                  </button>
                  <button 
                    (click)="confirmDelete(result)"
                    class="delete-button"
                  >
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- No Results Message -->
      <div *ngIf="!loading && filteredResults.length === 0" class="message">
        <span>No results found.</span>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div *ngIf="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-content">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete the result for "{{ resultToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button 
            (click)="cancelDelete()"
            class="cancel-button"
          >
            Cancel
          </button>
          <button 
            (click)="deleteResult()"
            class="confirm-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  results: Result[] = [];
  filteredResults: Result[] = [];
  searchTerm: string = '';
  showForm: boolean = false;
  editingResult: boolean = false;
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  resultForm: FormGroup;
  searchControl: FormControl;
  
  // For delete confirmation modal
  showDeleteConfirmation: boolean = false;
  resultToDelete: Result | null = null;
  private searchSubscription?: Subscription;

  constructor(
    private resultService: ResultService, 
    private fb: FormBuilder
  ) {
    // Initialize form controls in constructor
    this.searchControl = new FormControl('');
    this.resultForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      position: ['', [Validators.required]],
      winningAmount: [0, [Validators.required, Validators.min(1)]],
      eventId: ['', [Validators.required]],
      pId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadResults();
    
    // Subscribe to search control changes
    this.searchSubscription = this.searchControl.valueChanges.subscribe(value => {
      this.searchTerm = value || '';
      this.filterResults();
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.resultForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.editingResult = false;
    this.resultForm.reset({
      id: null,
      name: '',
      position: '',
      winningAmount: 0,
      eventId: '',
      pId: ''
    });
  }

  editResult(result: Result): void {
    this.editingResult = true;
    this.resultForm.setValue({
      id: result.id,
      name: result.name,
      position: result.position,
      winningAmount: result.winningAmount,
      eventId: result.eventId,
      pId: result.pId
    });
    this.showForm = true;
  }

  confirmDelete(result: Result): void {
    this.resultToDelete = result;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.resultToDelete = null;
    this.showDeleteConfirmation = false;
  }

  deleteResult(): void {
    if (!this.resultToDelete || !this.resultToDelete.id) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    
    this.resultService.deleteResult(this.resultToDelete.id.toString()).subscribe({
      next: () => {
        this.results = this.results.filter(r => r.id !== this.resultToDelete?.id);
        this.filterResults();
        this.successMessage = 'Result deleted successfully';
        this.loading = false;
        this.showDeleteConfirmation = false;
        this.resultToDelete = null;
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete result. Please try again.';
        console.error('Error deleting result:', error);
        this.loading = false;
        this.showDeleteConfirmation = false;
      }
    });
  }

  loadResults(): void {
    this.loading = true;
    this.errorMessage = null;
    
    this.resultService.getResults().subscribe({
      next: (data) => {
        this.results = data;
        this.filteredResults = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load results. Please try again later.';
        console.error('Error loading results:', error);
        this.loading = false;
        this.results = [];
        this.filteredResults = [];
      }
    });
  }

  filterResults(): void {
    if (!this.searchTerm) {
      this.filteredResults = this.results;
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredResults = this.results.filter(result =>
      result.name.toLowerCase().includes(searchTermLower)
    );
  }

  onSubmit(): void {
    if (this.resultForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.resultForm.controls).forEach(key => {
        const control = this.resultForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    
    const resultData: Result = this.resultForm.value;

    if (this.editingResult && resultData.id) {
      // Update existing result
      this.resultService.updateResult(resultData.id.toString(), resultData).subscribe({
        next: (result) => {
          const index = this.results.findIndex(r => r.id === result.id);
          if (index !== -1) {
            this.results[index] = result;
          }
          this.filterResults();
          this.resetForm();
          this.showForm = false;
          this.successMessage = 'Result updated successfully';
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update result. Please try again.';
          console.error('Error updating result:', error);
          this.loading = false;
        }
      });
    } else {
      // Create new result
      this.resultService.createResult(resultData).subscribe({
        next: (result) => {
          this.results.push(result);
          this.filterResults();
          this.resetForm();
          this.showForm = false;
          this.successMessage = 'Result added successfully';
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to add result. Please try again.';
          console.error('Error adding result:', error);
          this.loading = false;
        }
      });
    }
  }
}