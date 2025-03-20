import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  isAdminAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAdminAuthenticated$ =
    this.isAdminAuthenticatedSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.checkAdminAuthStatus();
  }

  private checkAdminAuthStatus() {
    this.apiService.get(`/adminAuth/is-admin`).subscribe({
      next: (response) => {
        if (response.message === 'Admin Authenticated') {
          this.isAdminAuthenticatedSubject.next(true);
        } else {
          this.isAdminAuthenticatedSubject.next(false);
        }
      },
      error: () => {
        this.isAdminAuthenticatedSubject.next(false);
      },
    });
  }

  loginAdmin(credentials: { email: string; password: string }) {
    return this.apiService.post(`/adminAuth/login`, credentials).pipe(
      tap((response) => {
        if (response || response.message === 'Admin logged in successfully') {
          console.log(`admin id: ${response.id}`);
          localStorage.setItem('adminName', response.name);
          localStorage.setItem('adminId', response.id);
          this.isAdminAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logoutAdmin() {
    return this.apiService.post(`/adminAuth/logout`, {}).pipe(
      tap((response) => {
        localStorage.removeItem('userId');
        if (response.message === 'Admin Logout successful.') {
          this.isAdminAuthenticatedSubject.next(false);
        }
      })
    );
  }

  isAdmin() {
    return this.apiService.get('/adminAuth/is-admin');
  }
}
