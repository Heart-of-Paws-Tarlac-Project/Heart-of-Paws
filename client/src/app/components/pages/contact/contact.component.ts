import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { InquiryService } from '../../../services/inquiry.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  isAuthenticated: boolean = false;
  private authSubscription: Subscription | null = null;

  errorMessage: string = '';
  contactForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNo: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    inquiry: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
  });

  constructor(
    private inquiryService: InquiryService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.contactForm.controls['name'].setValue(userName);
    }

    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        console.log(
          'User is authenticated from contact form:',
          isAuthenticated
        );
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  get name() {
    return this.contactForm.controls['name'];
  }

  get email() {
    return this.contactForm.controls['email'];
  }

  get phoneNo() {
    return this.contactForm.controls['phoneNo'];
  }

  get inquiry() {
    return this.contactForm.controls['inquiry'];
  }

  onSubmit() {
    if (!this.isAuthenticated) {
      localStorage.setItem('redirectUrl', this.router.url);
      this.router.navigate(['/login']);
      return;
    } else if (!this.contactForm.valid) {
      console.log('Contact form is invalid');
      this.contactForm.markAllAsTouched();
      return;
    }

    const inquiry = {
      name: this.name.value as string,
      email: this.email.value as string,
      phoneNo: this.phoneNo.value as string,
      inquiry: this.inquiry.value as string,
    };

    this.inquiryService.submitInquiry(inquiry).subscribe({
      next: (response) => {
        console.log('Inquiry sent successfully');
        this.contactForm.reset();
        alert('Inquiry sent successfully');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log('Error in sending inquiry');
        if (error.status === 500) {
          this.errorMessage = 'Oops! Something went wrong. Please try again.';
        }
      },
    });
  }
}
