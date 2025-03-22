import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private router: Router
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
}
