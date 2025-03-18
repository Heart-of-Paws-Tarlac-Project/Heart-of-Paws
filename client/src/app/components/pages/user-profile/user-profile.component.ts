import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { RescueService } from '../../../services/rescue.service';
import { ApplicationCardComponent } from '../../ui/application-card/application-card.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ApplicationCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  userProfile: any = {};
  userApplications: any[] = [];
  uploadNotification: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private rescueService: RescueService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.getUserProfile(userId);
    }
  }

  getUserProfile(userId: string) {
    this.userService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.userProfile = response.user;
        this.userApplications = response.applications;
      },
      error: (error) => {
        console.error('Error in retrieving user profile:', error);
      },
    });
  }

  //method to handle profile picture upload
  onFileSelected(event: Event, userId: string): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file: File = input.files[0];

      // Create a new FormData instance
      const formData = new FormData();

      // Use 'profileImage' to match what your server expects
      formData.append('profileImage', file, file.name); // Adding file.name can help

      console.log('Uploading file:', file.name, 'size:', file.size);

      this.userService.updateProfileImg(userId, formData).subscribe({
        next: (response) => {
          console.log('User profile image successfully updated:', response);
          this.getUserProfile(userId);
          this.uploadNotification = 'Profile image updated successfully.';
        },
        error: (error) => {
          console.error('Error in updating user profile image:', error);
          this.errorMessage =
            'Oops! Something went wrong trying to upload your photo. Please try again.';
        },
      });
    }
  }
}
