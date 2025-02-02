import { Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { AdoptComponent } from './components/adopt/adopt.component';

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'adopt', component: AdoptComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search' } 
];
