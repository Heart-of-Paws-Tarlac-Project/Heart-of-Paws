import { Component } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { CommonModule } from '@angular/common';
import { RescueService } from '../../../services/rescue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-rescue-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
  ],
  templateUrl: './create-rescue-form.component.html',
  styleUrl: './create-rescue-form.component.css',
})
export class CreateRescueFormComponent {
  createForm = new FormGroup({
    name: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(20),
      Validators.required,
    ]),
    sex: new FormControl('', Validators.required),
    ageValue: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[0-9]+$/),
    ]),
    ageUnit: new FormControl('', Validators.required),
    size: new FormControl('', Validators.required),
    vetStatus: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(10),
      Validators.required,
    ]),
    description: new FormControl('', [
      Validators.minLength(10),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
      Validators.required,
    ]),
    featuredImage: new FormControl<File | null>(null),
    galleryImages: new FormControl<File[]>([]),
  });

  constructor(private rescueService: RescueService, private router: Router) {}

  get name() {
    return this.createForm.controls['name'];
  }

  get sex() {
    return this.createForm.controls['sex'];
  }

  get size() {
    return this.createForm.controls['size'];
  }

  get vetStatus() {
    return this.createForm.controls['vetStatus'];
  }

  get description() {
    return this.createForm.controls['description'];
  }

  get featuredImage() {
    return this.createForm.controls['featuredImage'];
  }

  get galleryImages() {
    return this.createForm.controls['galleryImages'];
  }

  handleFeatureImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.createForm.patchValue({
        featuredImage: file,
      });
    }
  }

  handleGalleryImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.createForm.patchValue({
        galleryImages: files,
      });
    }
  }

  onSubmit() {
    if (this.createForm.invalid) {
      this.markFormGroupTouched(this.createForm);
      return;
    }
    console.log(this.createForm.value);

    const formData = this.createFormData(this.createForm.value);

    formData.forEach((value, key) => {
      console.log(`form submission: ${key}: ${value}`);
    });

    this.rescueService.addRescue(formData).subscribe({
      next: (response) => {
        if (response) {
          alert('Successfully created rescue');
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        alert(`Error in creating rescue: ${error} `);
        this.router.navigate(['/admin']);
      },
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createFormData(form: { [key: string]: any }) {
    const newRescue = new FormData();
    Object.entries(this.createForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'featuredImage' && value instanceof File) {
          newRescue.append('featuredImage', value, value.name);
        } else if (key === 'galleryImages' && Array.isArray(value)) {
          value.forEach((file: File) => {
            if (file instanceof File) {
              newRescue.append('galleryImages', file, file.name);
            }
          });
        } else {
          newRescue.append(key, String(value));
        }
      }
    });

    const ageValue = this.createForm.controls['ageValue'].value;
    const ageUnit = this.createForm.controls['ageUnit'].value;
    if (ageValue && ageUnit) {
      newRescue.append('age', `${ageValue} ${ageUnit} old`);
    }

    return newRescue;
  }
}
