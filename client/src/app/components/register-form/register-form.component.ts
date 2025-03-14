import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import { FormInputComponent } from '../ui/form-input/form-input.component';
import { ButtonComponent } from '../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../shared/validators/passwordMatchValidator';
import { OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  isSubmitted: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  //register inputs as a form group and add validators
  registerForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z\s]+$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator() }
  );

  ngOnInit(): void {
    // the value of password is retrieved from the get password getter method, and this listens to all
    // this.password.valueChanges.subscribe(() => {
    //   this.confirmPassword.updateValueAndValidity();
    // });
    // this.confirmPassword.valueChanges.subscribe(() => {
    //   this.password.updateValueAndValidity();
    // });
  }

  //helper methods, makes the variables names, emails, ids, accessible in the template for cleaner code instead of accessing form controls itself
  get name() {
    return this.registerForm.controls['name'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid');
      return;
    }

    console.log('form is valid');

    //the values are all retrieved from the getter methods which makes these variables accessible even if they are not explicitly defined.
    const user = {
      name: this.name.value as string,
      email: this.email.value as string,
      password: this.password.value as string,
    };

    this.authService.registerUser(user).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        alert('Registration successful');

        this.registerForm.reset();
        this.router.navigate(['login']);
      },
      error: (error) => {
        console.error('Registration failed');
        this.errorMessage =
          "Oops! We Couldn't process your request. Please try again later";
      },
    });
  }
}
