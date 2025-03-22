import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  getAllApplicationsForRescue(rescueId: string) {
    return this.apiService.get(`/applications/${rescueId}`);
  }

  getUserByApplication(applicationId: string) {
    return this.apiService.get(`/applications/${applicationId}/user`);
  }

  approveApplication(applicationId: string, status: string) {
    return this.apiService.patch(
      `/admin/applications/${applicationId}/status`,
      { status }
    );
  }

  getUser(userId: string) {
    return this.apiService.get(`/users/user/${userId}`);
  }

  getAllUsers() {
    return this.apiService.get('/users');
  }
}
