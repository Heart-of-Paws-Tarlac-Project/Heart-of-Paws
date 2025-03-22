import { Component, OnInit } from '@angular/core';
import { RescuesListComponent } from '../../pages/rescues-list/rescues-list.component';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../../services/admin-auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../ui/dialog/dialog.component';

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
  isSidebarHidden: boolean = true;

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isSidebarHidden = true;
      }
    });
  }

  ngOnInit(): void {
    this.adminAuthService.isAdminAuthenticated$.subscribe(
      (isAdminAuthenticated) => {
        console.log('is admin authenticated: ', isAdminAuthenticated);
        this.isAdminAuthenticated = isAdminAuthenticated;
      }
    );
  }

  logoutAdmin() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        modalTitle: 'Confirm Logout',
        modalDesc: 'Are you sure you want to log out?',
        yes: 'Logout',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminAuthService.logoutAdmin().subscribe({
          next: () => {
            console.log('Admin logged out');
            this.router.navigate(['/']);
          },
          error: () => {
            console.error('Error logging out');
          },
        });
      }
    });
  }

  isSidebarOpen: boolean = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }
}
