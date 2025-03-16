import { Routes } from '@angular/router';
import { RescuesListComponent } from './components/pages/rescues-list/rescues-list.component';
import { RescueDetailComponent } from './components/pages/rescue-detail/rescue-detail.component';
import { LoginFormComponent } from './components/pages/login-form/login-form.component';
import { RegisterFormComponent } from './components/pages/register-form/register-form.component';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/pages/admin-dashboard/admin-dashboard.component';
import { UnauthorizedComponent } from './components/pages/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '',
  },
  {
    path: '',
    component: HomeComponent,
  },
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
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
];
