import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  styles: [
    `
      :host {
        display: block;
        background: #f5f5f5 !important;
        background-image: none !important;
        min-height: 100vh;
      }

      :host::ng-deep body,
      :host::ng-deep html {
        background: #f5f5f5 !important;
        background-image: none !important;
      }
    `,
  ],
})
export class FormComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  userEmail = '';
  p_ID: number | null = null;
  hasExistingData = false;

  referralSources = [
    'Social Media',
    'College Notice',
    'Peer',
    'Faculty',
    'Alumni Program',
    'Other',
  ];
  types = ['Internal', 'External'];
  eventNames = [
    'Cricket Tournament',
    'Basketball Championship',
    'Football League',
    'Swimming Competition',
    'Tennis Championship',
    'Badminton Tournament',
    'Table Tennis Competition',
    'Chess Tournament',
    'Athletics Meet',
    'Volleyball Tournament',
    'Tech Talk',
    'Relay Race',
    'Sprint',
    'Kabaddi',
    
  ];
  departments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil',
    'Chemical Engineering',
    'Biotechnology',
    'Aeronautical Engineering',
    'Applied Sciences',
    'Management Studies',
    'Other',
  ];

  constructor(private fb: FormBuilder, public router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('username') || '';
    this.initForm();
    if (this.userEmail) {
      this.loadUserParticipation(this.userEmail);
    }
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      p_ID: [{ value: '', disabled: true }],
      referralSource: ['', Validators.required],
      type: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(15), Validators.max(120)]],
      gender: ['', Validators.required],
      eventName: ['', Validators.required],
      department: ['', Validators.required],
      medicalCondition: [''],
    });
  }

  loadUserParticipation(username: string): void {
    this.http.get<any[]>(`http://localhost:8080/data`).subscribe({
      next: (data) => {
        console.log('Loaded user data:', data);
        const userRecord = data.find((item) => item.username === username);
        if (userRecord) {
          this.hasExistingData = true;
          this.p_ID = userRecord.p_ID;

          this.registrationForm.patchValue({
            username: userRecord.username,
            referralSource: userRecord.referralSource,
            type: userRecord.type,
            age: userRecord.age,
            gender: userRecord.gender,
            eventName: userRecord.eventName || '',  // Use fallback if undefined or null
            department: userRecord.department,
            medicalCondition: userRecord.medicalCondition || '',
          });
          console.log('Found userRecord:', userRecord); // Add this
          this.p_ID = userRecord.p_ID;
          console.log('Setting p_ID:', this.p_ID); // Add this

          this.registrationForm.get('p_ID')?.setValue(userRecord.p_ID);
        } else {
          // No record found: Set just username
          this.registrationForm.patchValue({
            username: username,
          });
        }
      },
      error: (err) => {
        console.error('Error loading user participation data', err);
      }
    });
  }
  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }
  
    const formValue = {
      ...this.registrationForm.getRawValue(),
      username: this.userEmail,
      eventName: this.registrationForm.get('eventName')?.value || '',  // Fallback to empty string
      medicalCondition: this.registrationForm.get('medicalCondition')?.value || '',  // Fallback to empty string
    };
  
    console.log('Form Value:', formValue);  // Debugging line to check data
  
    this.isSubmitting = true;
  
    if (this.hasExistingData && this.p_ID) {
      this.http.put(`http://localhost:8080/update/${this.p_ID}`, formValue).subscribe({
        next: () => {
          this.router.navigate(['/success']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update data.';
          console.error(err);
          this.isSubmitting = false;
        },
      });
    } else {
      this.http.post(`http://localhost:8080/add`, formValue).subscribe({
        next: () => {
          this.router.navigate(['/success']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to submit data.';
          console.error(err);
          this.isSubmitting = false;
        },
      });
    }
  }
  
  

  navigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
