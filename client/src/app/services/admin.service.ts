import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private apiService: ApiService) {}

  updateRescueData(rescueId: string, data: FormData) {
    return this.apiService.patch(`/rescues/${rescueId}`, data);
  }
}
