import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  //to retrieve user's profile on profile component/application status
  getUserProfile(userId: string) {
    return this.apiService.get(`/users/${userId}`);
  }

  //to update user's profile image
  updateProfileImg(userId: string, image: FormData) {
    return this.apiService.patch(`/users/${userId}/profile-image`, image);
  }

  //to delete an application made by a user
  deleteApplication(applicationId: string) {
    return this.apiService.delete(`/applications/${applicationId}`);
  }
}
