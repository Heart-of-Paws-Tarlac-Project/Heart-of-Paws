import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterModule,
  Router,
  ActivatedRoute,
} from '@angular/router';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-inquiries-list',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './inquiries-list.component.html',
  styleUrl: './inquiries-list.component.css',
})
export class InquiriesListComponent implements OnInit {
  inquiries: any[] = [];
  isInboxHidden: boolean = false; // Default: Inbox is open

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    AOS.init();
  }
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
      error: () => {
        console.error('Error retrieving all inquiries');
      },
    });
  }

  viewInquiry(inquiryId: string) {
    this.router.navigate(['inquiry', inquiryId], { relativeTo: this.route });

    // Close inbox on mobile after selecting an inquiry
    if (window.innerWidth < 1024) {
      this.isInboxHidden = true;
    }
  }

  toggleInbox() {
    this.isInboxHidden = !this.isInboxHidden;
  }
}
