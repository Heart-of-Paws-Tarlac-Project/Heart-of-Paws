import { Component } from '@angular/core';
import { RescueService } from '../../../services/rescue.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.css',
})
export class ApplicationFormComponent implements OnInit {
  isSubmitted: boolean = false;
  errorMessage: string = '';

  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug'); //extract the slug from the activatedRoute params
      if (slug) {
        this.rescueService.getRescue(slug);
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
  });
  // helper methods

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
      console.log(`Application form is invalid`);
      return;
    }

    const application = {
      name: this.name.value as string,
      phoneNo: this.phoneNo.value as string,
      address: this.address.value as string,
      preferredModeOfContact: this.preferredModeOfContact.value as string,
      introductionMessage: this.introductionMessage.value as string,
      slug: this.rescue.slug,
    };

    this.rescueService.inquireAboutRescue(application).subscribe({
      next: (response) => {
        console.log(`Application successful: `, response.message);
        alert(
          `We have received your application for ${this.rescue.name}. We will send you an appointment date for your interview!`
        );
        this.router.navigate(['/rescues']);
      },
      error: (error) => {
        console.error('Error creating application: ', error);
        if (error.status) {
          this.errorMessage = 'Oops! Something went wrong. Please try again.';
        }
      },
    });
  }

  // get preferredDate() {
  //   return this.applicationForm.controls['preferredDate'];
  // }

  // get preferredTime() {
  //   return this.applicationForm.controls['preferredTime'];
  // }
}
