import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { UserCardComponent } from '../user-card/user-card.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, UserCardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  users: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    AOS.init();
  }

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  loadUsers() {
    const cachedUsers = localStorage.getItem('users');

    if (cachedUsers) {
      console.log('Loading users from localStorage:', cachedUsers);
      this.users = JSON.parse(cachedUsers);
    }

    this.adminService.getAllUsers().subscribe({
      next: (response) => {
        if (response.length > 0) {
          console.log('Fetched users from API:', response);
          this.users = response;
          localStorage.setItem('users', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.error('Error retrieving all users', error);
      },
    });
  }
}
