import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// this is a custom validator function to compare password and customPassword fields

// it returns a function that receives a form control as an argument, and will either return validation errors if a mismatch happens, or null if the passwords match

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Only validate if both fields have values
    if (
      !password ||
      !confirmPassword ||
      !password.value ||
      !confirmPassword.value
    ) {
      return null;
    }

    // Set the error on the confirmPassword control too
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if it was previously set
      const errors = confirmPassword.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null; //return null
    }
  };
}
