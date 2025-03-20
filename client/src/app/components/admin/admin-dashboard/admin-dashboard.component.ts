import { Component } from '@angular/core';
import { RescuesListComponent } from '../../pages/rescues-list/rescues-list.component';
import { Router, RouterOutlet } from '@angular/router';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RescuesListComponent,
    RouterOutlet,
    RescueCardComponent,
    CommonModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {}
