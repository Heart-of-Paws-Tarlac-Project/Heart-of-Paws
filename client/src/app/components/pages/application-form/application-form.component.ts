// filepath: c:\Users\user\Desktop\awebfinals\Heart-of-Paws-Tarlac-Web-Application\client\src\app\components\pages\application-form\application-form.component.ts
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { RescueService } from '../../../services/rescue.service';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css',
})
export class ApplicationFormComponent implements OnInit {
  isSubmitted: boolean = false;
  availableDates: { date: string; availableSlots: string[] }[] = [];
  availableSlots: string[] = [];
  selectedDate: string = '';
  selectedTimeSlot: string = '';
  errorMessage: string = '';

  ngAfterViewInit(): void {
    AOS.init();
  }

  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug'); //extract the slug from the activatedRoute params
      if (slug) {
        this.rescueService.getRescue(slug);
        this.loadAvailableDates();
      }
    });

    // Set the value of the name form control to the logged-in user's name from local storage
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.applicationForm.controls['name'].setValue(userName);
    }
  }

  get rescue() {
    return this.rescueService.rescue$();
  }

  applicationForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(100),
    ]),
    preferredModeOfContact: new FormControl('', [Validators.required]),
    introductionMessage: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    preferredDate: new FormControl('', [Validators.required]),
    preferredTime: new FormControl('', [Validators.required]),
  });

  // helper methods
  preferredDate: Date | null = null;
  onDateChange(event: any) {
    const date = event.value;
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const available = this.availableDates.find((d) => d.date === formattedDate);
    this.availableSlots = available ? available.availableSlots : [];
    this.preferredDate = event.value;
  }

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    // Get today's date (current date) and format it as 'YYYY-MM-DD'
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Format the selected date as 'YYYY-MM-DD'
    const formattedDate = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    // If the selected date is before today, disable it
    if (formattedDate < formattedToday) {
      return false;
    }

    // Find the available slot for the given date
    const available = this.availableDates.find(
      (slot) => slot.date === formattedDate
    );

    // Only enable dates with available slots
    return !!available;
  };

  loadAvailableDates() {
    this.rescueService.loadAvailableDates().subscribe({
      next: (response) => {
        this.availableDates = response.availableDates;

        // Log the available dates
        console.log('Available Dates:', this.availableDates);

        // To log individual date values
        this.availableDates.forEach((availableDate) => {
          console.log(`Available Date: ${availableDate.date}`);
        });
      },
      error: (error) => {
        console.error('Error fetching available dates: ', error);
      },
    });
  }

  get name() {
    return this.applicationForm.controls['name'];
  }

  get phoneNo() {
    return this.applicationForm.controls['phone'];
  }

  get address() {
    return this.applicationForm.controls['address'];
  }

  get preferredModeOfContact() {
    return this.applicationForm.controls['preferredModeOfContact'];
  }

  get introductionMessage() {
    return this.applicationForm.controls['introductionMessage'];
  }

  onSubmit() {
    if (this.applicationForm.invalid) {
      this.applicationForm.markAllAsTouched();
      console.log('Application form is invalid');
      return;
    }

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: 'Confirm Application',
        modalDesc: `Are you sure you want to apply for the adoption of ${this.rescue.name}?`,
        yes: 'Yes',
        no: 'No',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Get the date value
        const dateValue = this.applicationForm.controls['preferredDate'].value;

        // Create a date object without timezone conversion
        const selectedDate = new Date(dateValue as string);

        // Get the date in YYYY-MM-DD format while preserving the local date
        const formattedDate = `${selectedDate.getFullYear()}-${String(
          selectedDate.getMonth() + 1
        ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

        const application = {
          applicantName: this.name.value as string,
          phoneNo: this.phoneNo.value as string,
          address: this.address.value as string,
          appointmentMode: this.preferredModeOfContact.value as string,
          introductionMessage: this.introductionMessage.value as string,
          interviewDate: formattedDate, // Use the properly formatted date
          interviewTime: this.applicationForm.controls['preferredTime'].value,
          slug: this.rescue.slug,
        };

        this.rescueService.inquireAboutRescue(application).subscribe({
          next: (response) => {
            console.log('Application successful: ', response.message);
            alert(
              `We have received your application for ${this.rescue.name}. We will send you an appointment date for your interview!`
            );
            this.router.navigate(['/rescues']);
          },
          error: (error) => {
            console.error('Error creating application: ', error);
            if (error.status === 400) {
              this.errorMessage = error.error.message;
              this.applicationForm.reset();
            }
          },
        });
      }
    });
  }
}
