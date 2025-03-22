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
  hasQuery: boolean = false;
  filteredUsers: any[] = [];

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

  sendData(event: any) {
    let query: string = event.target.value;

    //will match if query is nothing or is only spaces
    let matchSpaces: any = query.match(/\s*/);
    if (matchSpaces[0] === query) {
      this.filteredUsers = [];
      this.hasQuery = false;
      return;
    }

    this.userService.searchUsers(query.trim()).subscribe((results) => {
      this.filteredUsers = results;
      this.hasQuery = true;
      console.log(results);
    });

    query = event.target.value.trim();
    this.hasQuery = query.length > 0;
    this.isDropdownOpen = this.hasQuery;
  }

  viewUserDetails(userId: string) {
    this.router.navigate(['/admin/users/user', userId]);
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
  isDropdownOpen: boolean = false;

  // Close dropdown with delay (for smooth transition)
  closeDropdownWithDelay() {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }
}
