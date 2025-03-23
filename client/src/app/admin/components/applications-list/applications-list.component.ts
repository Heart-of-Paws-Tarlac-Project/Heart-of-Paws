import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './applications-list.component.html',
  styleUrl: './applications-list.component.css',
})
export class ApplicationsListComponent implements OnInit {
  applications: any[] = [];
  hasQuery: boolean = false;
  filteredApplications: any[] = [];
  activeFilter: string = 'all';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  ngAfterViewInit(): void {
    AOS.init();
  }

  sendData(event: any) {
    let query: string = event.target.value;

    //will match if query is nothing or is only spaces
    let matchSpaces: any = query.match(/\s*/);
    if (matchSpaces[0] === query) {
      this.filteredApplications = [];
      this.hasQuery = false;
      return;
    }

    this.adminService.searchApplications(query.trim()).subscribe((results) => {
      this.filteredApplications = results;
      this.hasQuery = true;
      console.log(results);
    });

    query = event.target.value.trim();
    this.hasQuery = query.length > 0;
    this.isDropdownOpen = this.hasQuery;
  }

  viewApplicationDetails(applicationId: string) {
    this.router.navigate(['/admin/rescue/applications/', applicationId]);
  }

  loadApplications() {
    const cachedApplications = localStorage.getItem('applications');

    if (cachedApplications) {
      console.log('Loading users from localStorage:', cachedApplications);
      this.applications = JSON.parse(cachedApplications);
    }

    this.adminService.getAllApplications().subscribe({
      next: (response) => {
        if (response.length > 0) {
          console.log('Fetched users from API:', response);
          this.applications = response;
          localStorage.setItem('users', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.error('Error retrieving all users', error);
      },
    });
  }

  filterApplicationsByStatus(statusFilter: string) {
    this.activeFilter = statusFilter;

    if (statusFilter === 'all') {
      this.loadApplications();
      return;
    }

    this.adminService.filterApplications(statusFilter).subscribe({
      next: (response) => {
        this.applications = response;
      },
      error: (error) => {
        console.error('Error retrieving applications', error);
      },
    });
  }

  isDropdownOpen: boolean = false;

  closeDropdownWithDelay() {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }
}
