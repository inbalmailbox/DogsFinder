import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DogService } from '../../services/dog.service';
import { Subject, debounceTime, takeUntil, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class SearchComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private dogService = inject(DogService);

  private destroy$ = new Subject<void>();

  form: FormGroup;
  breeds: { breed: string; subBreeds: string[] }[] = [];
  images: string[] = [];

  constructor() {
    this.form = this.fb.group({
      breed: [''],
      subBreed: [''],
      count: [10]
    });
  }

  ngOnInit() {
    this.dogService.getBreeds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((breeds) => {
        this.breeds = breeds;
      });

    this.form.valueChanges
      .pipe(debounceTime(300), tap(() => (this.images = [])), takeUntil(this.destroy$))
      .subscribe((values: { breed: string; subBreed: string; count: number }) => {
        const { breed, subBreed, count } = values;

        if (breed) {
          this.dogService.getDogsByBreed(breed, subBreed)
            .pipe(takeUntil(this.destroy$))
            .subscribe((images: string[]) => {
              this.images = images.slice(0, count || 10);
            });
        }
      });
  }

  getSubBreeds(): string[] {
    const selectedBreed = this.breeds.find((b) => b.breed === this.form.value.breed);
    return selectedBreed?.subBreeds || [];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); 
  }
}
