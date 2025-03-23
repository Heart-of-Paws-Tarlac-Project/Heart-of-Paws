import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  userId: string = '';
  userData: any = null;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userIdFromRoute = params.get('id');
      if (userIdFromRoute) {
        console.log(`User ID from route: ${userIdFromRoute}`);
        this.userId = userIdFromRoute;
        this.loadUserDetail();
      }
    });
  }

  ngAfterViewInit(): void {
    AOS.init();
  }

  loadUserDetail() {
    this.adminService.getUser(this.userId).subscribe({
      next: (response) => {
        if (response) {
          console.log(`Fetched user from API:`, response);
          this.userData = response;
        }
      },
      error: (error) => {
        console.error('Error retrieving user data', error);
      },
    });
  }

  viewApplicationDetails(applicationId: string) {
    this.router.navigate(['/admin/rescue/applications', applicationId]);
  }
}
