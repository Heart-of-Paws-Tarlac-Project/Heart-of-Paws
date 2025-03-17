import { Component } from '@angular/core';
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
export class LoginFormComponent {
  isSubmitted: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

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

    //call authService's login method
    this.authService.loginUser(userCred).subscribe({
      next: () => {
        console.log('User successfully logged in');
        if (redirectUrl) {
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
          return;
        }
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log('Error in logging user');
        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password';
        } else {
          this.errorMessage = 'Oops! Something went wrong. Please try again.';
        }
      },
    });
  }
}
