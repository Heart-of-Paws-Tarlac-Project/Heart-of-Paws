import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
    private router: Router,
    private dialog: MatDialog
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

  ngAfterViewInit(): void {
    AOS.init();
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

  openConfirmationDialog(action: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: `${action} Application`,
        modalDesc: `Are you sure you want to ${action.toLowerCase()} this application for ${
          this.userData.applicantName
        }?`,
        yes: 'Confirm',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        action === 'Approve'
          ? this.approveApplication()
          : this.rejectApplication();
      }
    });
  }

  approveApplication() {
    this.status = 'approved';
    this.adminService
      .approveApplication(this.applicationId, this.status)
      .subscribe({
        next: () => {
          alert(
            `Rescue ${this.userData.rescue.name} has been approved for adoption.`
          );
          this.router.navigate(['/admin']);
        },
        error: () => {
          console.error('Error approving application.');
        },
      });
  }

  rejectApplication() {
    this.status = 'rejected';
    this.adminService
      .approveApplication(this.applicationId, this.status)
      .subscribe({
        next: () => {
          alert(
            `${this.userData.applicantName}'s application has been rejected.`
          );
          this.router.navigate(['/admin']);
        },
        error: () => {
          console.error('Error rejecting application.');
        },
      });
  }

  isModalOpen: boolean = false;
  selectedImage: string = '';

  openImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.isModalOpen = true;
  }

  closeImage(): void {
    this.isModalOpen = false;
  }
}
