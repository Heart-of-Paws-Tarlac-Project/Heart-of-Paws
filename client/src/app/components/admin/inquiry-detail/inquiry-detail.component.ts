import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../../ui/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inquiry-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inquiry-detail.component.html',
  styleUrl: './inquiry-detail.component.css',
})
export class InquiryDetailComponent implements OnInit {
  inquiry: any;
  inquiryId: string = '';
  inquiryData: any = null;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const inquiryIdFromRoute = params.get('inquiryId');

      if (inquiryIdFromRoute) {
        this.inquiryId = inquiryIdFromRoute;
      }

      if (this.inquiryId) {
        this.loadInquiryDetail();
      }
    });
  }

  loadInquiryDetail() {
    this.adminService.getInquiry(this.inquiryId).subscribe({
      next: (response) => {
        console.log('Retrieved inquiry data');
        this.inquiryData = response;
      },
      error: (error) => {
        console.error('Error in fetching inquiry data.  ', error);
      },
    });
  }

  respondToInquiry() {
    if (!this.message.trim()) {
      return;
    }

    console.log(`this inquiry id: ${this.inquiryId}`);
    console.log(`this  message: ${this.message}`);

    this.adminService.sendResponse(this.inquiryId, this.message).subscribe({
      next: (response) => {
        alert('Response sent to user.');
        this.inquiryData.responses.push({
          message: this.message,
          timestamp: new Date(),
        });
        this.message = '';
      },
      error: (error) => {
        console.error('Error in submitting respond: ', error);
      },
    });
  }

  confirmDeletion(event: Event, inquiryId: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {
        modalTitle: 'Confirm Submission',
        modalDesc: 'Are you sure you want to create this rescue?',
        yes: 'Confirm',
        no: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.deleteInquiry(inquiryId);
      }
    });
  }

  deleteInquiry(inquiryId: string) {
    this.adminService.deleteInquiry(inquiryId).subscribe({
      next: (response) => {
        alert('Deleted inquiry');
        console.log('Deleted inquiry');
        this.router.navigate(['/admin/inquiries']).then(() => {
          // Reload the entire page
          window.location.reload();
        });
      },
      error: (error) => {
        alert('Oops! Something went wrong. Please try again');
        console.error('Error in deleting inquiry:', error);
      },
    });
  }
}
