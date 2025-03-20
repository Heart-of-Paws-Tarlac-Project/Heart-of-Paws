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

@Component({
  selector: 'app-update-rescue-form',
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
  templateUrl: './update-rescue-form.component.html',
  styleUrl: './update-rescue-form.component.css',
})
export class UpdateRescueFormComponent implements OnInit {
  updateForm = new FormGroup({
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
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.rescueService.getRescue(slug);
      }
    });
  }

  get rescue() {
    return this.rescueService.rescue$();
  }

  get name() {
    return this.updateForm.controls['name'];
  }

  get description() {
    return this.updateForm.controls['description'];
  }

  get age() {
    return this.updateForm.controls['age'];
  }

  get sex() {
    return this.updateForm.controls['sex'];
  }

  handleFeatureImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.updateForm.patchValue({
        featureImage: file,
      });
    }
  }

  handleGalleryImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.updateForm.patchValue({
        galleryImages: files,
      });
    }
  }

  onSubmit(rescueId: string) {
    console.log('Form Values:', this.updateForm.value); // Log the form values here

    const formData = new FormData();

    Object.entries(this.updateForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
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

    console.log('FormData:', formData); // Log the FormData object

    this.adminService.updateRescueData(rescueId, formData).subscribe({
      next: () => {
        this.router.navigate(['/rescues', rescueId]);
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
