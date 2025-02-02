import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-adopt',
  templateUrl: './adopt.component.html',
  styleUrls: ['./adopt.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class AdoptComponent implements OnDestroy {
  private fb = new FormBuilder();
  private destroy$ = new Subject<void>();

  form: FormGroup;
  colors = ['White', 'Black', 'Brown', 'Golden', 'Gray', 'Mixed'];
  loading = false; 
  constructor() {
    this.form = this.fb.group({
      weight: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      color: ['', Validators.required],
      isFirstAdoption: [false],
      age: [null, [Validators.required, Validators.min(0), Validators.max(20)]]
    });

    this.form.get('isFirstAdoption')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFirstAdoption) => {
        const ageControl = this.form.get('age');
        if (isFirstAdoption) {
          ageControl?.setValidators([Validators.required, Validators.min(0), Validators.max(8)]);
        } else {
          ageControl?.setValidators([Validators.required, Validators.min(0), Validators.max(20)]);
        }
        ageControl?.updateValueAndValidity();
      });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true; 

      setTimeout(() => {
        this.loading = false;
        alert('Your adoption request has been registered in the system');
        this.form.reset();
      }, 2000); 
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
