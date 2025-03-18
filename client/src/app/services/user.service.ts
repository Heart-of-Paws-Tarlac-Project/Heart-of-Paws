import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUserProfile(userId: string) {
    return this.apiService.get(`/users/${userId}`);
  }

  updateProfileImg(userId: string, image: FormData) {
    return this.apiService.patch(`/users/${userId}/profile-image`, image);
  }
}
