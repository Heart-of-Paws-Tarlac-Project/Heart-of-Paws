import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs';

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

  deleteRescue(rescueId: string) {
    return this.apiService.delete(`/rescues/rescue/${rescueId}`);
  }

  getAllInquiries() {
    return this.apiService.get('/inquiries');
  }

  getInquiry(inquiryId: string) {
    return this.apiService.get(`/inquiries/inquiry/${inquiryId}`);
  }

  sendResponse(inquiryId: string, message: any) {
    return this.apiService.post(`/admin/inquiries/inquiry/${inquiryId}`, {
      message,
    });
  }

  getAllRescues() {
    return this.apiService.get('/rescues/allRescues');
  }

  deleteInquiry(inquiryId: string) {
    return this.apiService.delete(`/inquiries/${inquiryId}`);
  }

  getAllApplications() {
    return this.apiService.get('/applications/');
  }

  searchApplications(query: string) {
    return this.apiService
      .post('/applications/searchApplications', { payload: query })
      .pipe(map((data) => data.payload));
  }

  filterApplications(statusFilter: string) {
    return this.apiService.get(`/applications/?status=${statusFilter}`);
  }
}
