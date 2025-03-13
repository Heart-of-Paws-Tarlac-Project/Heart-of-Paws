import { Routes } from '@angular/router';
import { RescuesListComponent } from './components/rescues-list/rescues-list.component';
import { RescueDetailComponent } from './components/rescue-detail/rescue-detail.component';

export const routes: Routes = [
  {
    path: 'rescues',
    component: RescuesListComponent,
  },
  {
    path: 'rescues/:slug',
    component: RescueDetailComponent,
  },
];
