import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../../../../services/admin-auth.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css',
})
export class AdminNavbarComponent implements OnInit {
  isAdminAuthenticated: boolean = false;
  private adminAuthSub: Subscription | null = null;

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.adminAuthService.isAdminAuthenticated$.subscribe(
      (isAdminAuthenticated) => {
        console.log('is admin authenticated: ', isAdminAuthenticated);
        this.isAdminAuthenticated = isAdminAuthenticated;
      }
    );
  }

  logoutAdmin() {
    this.adminAuthService.logoutAdmin().subscribe({
      next: (response) => {
        console.log('Admin has been successfully logged out');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error logging out admin');
      },
    });
  }
}
