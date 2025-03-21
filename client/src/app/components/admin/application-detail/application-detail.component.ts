import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-detail.component.html',
  styleUrl: './application-detail.component.css',
})
export class ApplicationDetailComponent implements OnInit {
  applicationId: string = '';
  userData: any = null;
  status: string = '';

  constructor(
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const applicationIdFromRoute = params.get('applicationId');

      if (applicationIdFromRoute) {
        this.applicationId = applicationIdFromRoute;
      }

      if (this.applicationId) {
        this.loadApplication();
      }
    });
  }

  loadApplication() {
    this.adminService.getUserByApplication(this.applicationId).subscribe({
      next: (response) => {
        console.log('Retrieved applicant info');
        this.userData = response;
      },
      error: (error) => {
        console.error('Error in retrieving applicant data, ', error);
      },
    });
  }

  approveApplication(applicationId: string) {
    this.status = 'approved';
    this.adminService
      .approveApplication(this.applicationId, this.status)
      .subscribe({
        next: (response) => {
          alert(
            `Rescue ${this.userData.rescue.name} has been approved for adoption to ${this.userData.applicantName}`
          );
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error approving user application.');
          this.router.navigate(['/admin']);
        },
      });
  }

  rejectApplication(applicationId: string) {
    this.status = 'rejected';
    this.adminService
      .approveApplication(this.applicationId, this.status)
      .subscribe({
        next: (response) => {
          alert(
            `Rescue ${this.userData.rescue.name} has been rejected for adoption to ${this.userData.applicantName}`
          );
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          console.error('Error approving user application.');
          this.router.navigate(['/admin']);
        },
      });
  }
}
