import { Component } from '@angular/core';
import { RescuesListComponent } from '../../pages/rescues-list/rescues-list.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminNavbarComponent } from '../ui/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RescuesListComponent,
    RouterOutlet,
    CommonModule,
    AdminNavbarComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {}
