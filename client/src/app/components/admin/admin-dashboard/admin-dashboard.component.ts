import { Component, OnInit } from '@angular/core';
import { RescuesListComponent } from '../../pages/rescues-list/rescues-list.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../../services/admin-auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RescuesListComponent, RouterOutlet, CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
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

  isSidebarOpen: boolean = false;

  toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('-translate-x-full');
    }
  }
}
