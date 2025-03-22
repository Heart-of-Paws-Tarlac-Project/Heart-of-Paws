import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import AOS from 'aos';
import 'aos/dist/aos.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

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
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('mapContainer2', { static: false }) mapContainer2!: ElementRef;
  private desktopMap!: Map;
  private mobileMap!: Map;

  ngAfterViewInit(): void {
    AOS.init();
    const tarlacCoordinates = fromLonLat([120.5979, 15.4822]);

    if (this.mapContainer) {
      this.desktopMap = new Map({
        target: this.mapContainer.nativeElement,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: tarlacCoordinates,
          zoom: 14,
        }),
      });
      console.log('Desktop Map initialized');
    }

    // **Initialize Mobile Map**
    if (this.mapContainer2) {
      this.mobileMap = new Map({
        target: this.mapContainer2.nativeElement,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: tarlacCoordinates,
          zoom: 14,
        }),
      });
      console.log('Mobile Map initialized');
    }
  }
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
    subject: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
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

  get subject() {
    return this.contactForm.controls['subject'];
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
      subject: this.subject.value as string,
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
