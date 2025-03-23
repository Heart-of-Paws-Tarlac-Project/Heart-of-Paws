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
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    vetStatus: new FormControl<string[]>([], [Validators.required]),
    description: new FormControl('', [
      Validators.minLength(10),
      Validators.pattern(/^[A-Za-z\s]+$/),
      Validators.maxLength(50),
    ]),
    featuredImage: new FormControl<File | null>(null), // Keep as featureImage to match server expectation
    galleryImages: new FormControl<File[]>([]),
  });

  constructor(
    private rescueService: RescueService,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    AOS.init();
  }

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

  get vetStatus() {
    return this.updateForm.controls['vetStatus'];
  }

  get featureImage() {
    return this.updateForm.controls['featuredImage']; // Keep as featureImage
  }

  get galleryImages() {
    return this.updateForm.controls['galleryImages'];
  }

  handleFeatureImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Update the form control with the selected file
      this.updateForm.patchValue({
        featuredImage: file, // Keep as featureImage
      });
    }
  }

  handleGalleryImagesUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      // Update the form control with the selected files
      this.updateForm.patchValue({
        galleryImages: files,
      });
    }
  }

  onSubmit(rescueId: string) {
    console.log('Form Values:', this.updateForm.value); // Log the form values here
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    const vetStatusArray = this.updateForm.get('vetStatus')?.value || [];
    if (input.checked) {
      vetStatusArray.push(value); // Add the value to the array if checked
    } else {
      const index = vetStatusArray.indexOf(value);
      if (index > -1) {
        vetStatusArray.splice(index, 1); // Remove the value from the array if unchecked
      }
    }

    this.updateForm.patchValue({ vetStatus: vetStatusArray });
  }

  createFormData(): FormData {
    const formData = new FormData();
    Object.entries(this.updateForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'featuredImage' && value instanceof File) {
          // Keep as featureImage
          formData.append('featuredImage', value, value.name); // Keep as featureImage to match server expectation
        } else if (key === 'galleryImages' && Array.isArray(value)) {
          (value as File[]).forEach((file: File) => {
            if (file instanceof File) {
              formData.append('galleryImages', file, file.name);
            }
          });
        } else if (key === 'vetStatus') {
          if (Array.isArray(value)) {
            formData.append('vetStatus', value.join(', '));
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  confirmUpdate(rescueId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: 'Confirm Update',
        modalDesc: 'Are you sure you want to update this rescue?',
        yes: 'Update',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.rescueService
          .updateRescueData(rescueId, this.createFormData())
          .subscribe({
            next: (response) => {
              alert('Rescue updated successfully.');
              this.router.navigate(['admin/rescue/', response.slug]);
            },
            error: (err) => {
              alert('An error occurred while updating the rescue.');
              this.router.navigate(['/admin']);
            },
          });
      }
    });
  }
}
