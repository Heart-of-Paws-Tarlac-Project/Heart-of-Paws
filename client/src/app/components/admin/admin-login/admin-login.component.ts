import { Component } from '@angular/core';
import { LoginFormComponent } from '../../pages/login-form/login-form.component';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {}
