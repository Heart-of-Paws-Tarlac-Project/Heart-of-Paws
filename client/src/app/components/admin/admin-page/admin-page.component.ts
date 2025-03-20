import { Component } from '@angular/core';
import { AdminNavbarComponent } from '../ui/admin-navbar/admin-navbar.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [AdminNavbarComponent, RouterOutlet],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css',
})
export class AdminPageComponent {}
