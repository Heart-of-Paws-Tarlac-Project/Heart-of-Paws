import { Component } from '@angular/core';
import { RescuesListComponent } from '../../pages/rescues-list/rescues-list.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RescuesListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
