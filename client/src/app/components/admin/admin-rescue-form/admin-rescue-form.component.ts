import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormInputComponent } from '../../ui/form-input/form-input.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { RescueService } from '../../../services/rescue.service';
import { AdminService } from '../../../services/admin.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-admin-rescue-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ButtonComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-rescue-form.component.html',
  styleUrl: './admin-rescue-form.component.css',
})
export class AdminRescueFormComponent implements OnInit {
  @Input() mode: 'create' | 'update' = 'create';

  rescueForm = new FormGroup({
    name: new FormControl('', [
      Validators.minLength(3),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(10),
    ]),
    sex: new FormControl(''),
    age: new FormControl(''),
    availability: new FormControl(''),
    size: new FormControl(''),
    vetStatus: new FormControl(''),
    description: new FormControl('', [
      Validators.minLength(10),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
    ]),
    featureImage: new FormControl<File | null>(null),
    galleryImages: new FormControl<File[]>([]),
  });

  constructor(
    private rescueService: RescueService,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.mode === 'update') {
      this.activatedRoute.paramMap.subscribe((params) => {
        const slug = params.get('slug');
        if (slug) {
          this.rescueService.getRescue(slug);
          return;
        }
      });
    }

    this.rescueForm.controls['name'].addValidators(Validators.required);

    this.rescueForm.updateValueAndValidity();
  }

  get rescue() {
    return this.rescueService.rescue$();
  }

  get name() {
    return this.rescueForm.controls['name'];
  }

  get description() {
    return this.rescueForm.controls['description'];
  }

  get age() {
    return this.rescueForm.controls['age'];
  }

  get sex() {
    return this.rescueForm.controls['sex'];
  }

  handleFeatureImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.rescueForm.patchValue({
        featureImage: file,
      });
    }
  }

  handleGalleryImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.rescueForm.patchValue({
        galleryImages: files,
      });
    }
  }

  onSubmit(rescueId: string) {
    console.log('Form Values:', this.rescueForm.value); // Log the form values here

    const formData = new FormData();

    Object.entries(this.rescueForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'featureImage' && value instanceof File) {
          formData.append('featureImage', value, value.name);
        } else if (key === 'galleryImages' && Array.isArray(value)) {
          value.forEach((file: File) => {
            if (file instanceof File) {
              formData.append('galleryImages', file, file.name);
            }
          });
        } else {
          formData.append(key, String(value));
        }
      }
    });

    console.log('Individual FormData values:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    this.rescueService.updateRescueData(rescueId, formData).subscribe({
      next: (response) => {
        console.log('Updated Rescue Response:', response);
        this.router.navigate(['admin/rescue/', response.rescue.slug]);
      },
      error: (err) => {
        console.error('Error updating rescue:', err);
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
}
