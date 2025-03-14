import { Routes } from '@angular/router';
import { RescuesListComponent } from './components/rescues-list/rescues-list.component';
import { RescueDetailComponent } from './components/rescue-detail/rescue-detail.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

export const routes: Routes = [
  {
    path: 'rescues',
    component: RescuesListComponent,
  },
  {
    path: 'rescues/:slug',
    component: RescueDetailComponent,
  },
  {
    path: 'register',
    component: RegisterFormComponent,
  },
  {
    path: 'login',
    component: LoginFormComponent,
  },
];
