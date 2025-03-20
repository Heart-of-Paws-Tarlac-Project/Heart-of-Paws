import { Component, Input, OnInit } from '@angular/core';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormInputComponent,
    ButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {
  @Input() userType: 'admin' | 'user' = 'user';
  isSubmitted: boolean = false;
  errorMessage: string = '';
  welcomeMessage: string = '';
  ngAfterViewInit(): void {
    AOS.init();
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    if (this.userType === 'admin') {
      console.log(`User type: ${this.userType}`);
      this.welcomeMessage = 'Admin Login';
      return;
    }
    this.welcomeMessage = 'Welcome Back';
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  //helper methods, makes the variables names, emails, ids, accessible in the template for cleaner code instead of accessing form controls itself
  get email() {
    return this.loginForm.controls['email'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  submitForm() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      console.log('Login form is invalid');
      return;
    }

    const userCred = {
      email: this.email.value as string,
      password: this.password.value as string,
    };

    const redirectUrl = localStorage.getItem('redirectUrl'); //if an user was redirected from application page

    //if form was used for admin login
    if (this.userType === 'admin') {
      this.adminAuthService.loginAdmin(userCred).subscribe({
        next: () => {
          console.log('Admin successfully logged in');
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.log('Error in logging admin.');
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password';
          } else {
            this.errorMessage = 'Oops! Something went wrong. Please try again.';
          }
        },
      });
      return;
    }

    //call authService's login method
    this.authService.loginUser(userCred).subscribe({
      next: (response) => {
        console.log(`response: ${response.role}`);

        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
          return; // Stop further execution if the user is an admin
        }

        const redirectUrl = localStorage.getItem('redirectUrl');
        if (redirectUrl) {
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        if (err.status === 401) {
          this.errorMessage = 'Invalid email or password';
        }
      },
    });
  }
}
