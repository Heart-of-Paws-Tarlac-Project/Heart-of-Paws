import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';

@Component({
  selector: 'app-inquiries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './inquiries-list.component.html',
  styleUrl: './inquiries-list.component.css',
})
export class InquiriesListComponent implements OnInit {
  inquiries: any[] = [];
  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadInquiries();
  }

  loadInquiries() {
    const cachedInquiries = localStorage.getItem('inquiries');

    if (cachedInquiries) {
      this.inquiries = JSON.parse(cachedInquiries);
    }

    this.adminService.getAllInquiries().subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.inquiries = response;
          localStorage.setItem('inquiries', JSON.stringify(response));
        }
      },
      error: (error) => {
        console.error('Error retrieving all inquiries');
      },
    });
  }

  viewInquiry(inquiryId: string) {
    this.router.navigate(['inquiry', inquiryId], { relativeTo: this.route });
  }
}
