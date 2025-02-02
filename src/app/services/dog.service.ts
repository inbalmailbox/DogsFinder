import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private apiUrl = 'https://dog.ceo/api';

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<{ breed: string; subBreeds: string[] }[]> {
    return this.http.get<{ message: Record<string, string[]> }>(`${this.apiUrl}/breeds/list/all`).pipe(
      map((response) =>
        Object.entries(response.message)
          .filter(([_, subBreeds]) => subBreeds.length > 0)
          .map(([breed, subBreeds]) => ({ breed, subBreeds }))
      )
    );
  }

  getDogsByBreed(breed: string, subBreed: string): Observable<string[]> {
    const endpoint = subBreed ? `${breed}/${subBreed}` : breed;
    return this.http.get<{ message: string[] }>(`${this.apiUrl}/breed/${endpoint}/images`).pipe(
      map((response) => response.message)
    );
  }
}
