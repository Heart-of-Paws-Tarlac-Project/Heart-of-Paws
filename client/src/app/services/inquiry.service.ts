import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class InquiryService {
  constructor(private apiService: ApiService) {}

  submitInquiry(inquiry: any) {
    return this.apiService.post(`/inquiries/`, inquiry);
  }
}
