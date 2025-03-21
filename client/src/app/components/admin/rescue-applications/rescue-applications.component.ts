import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rescue-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rescue-applications.component.html',
  styleUrl: './rescue-applications.component.css',
})
export class RescueApplicationsComponent implements OnInit {
  @Input() rescueSlug: string = '';
  applications: any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug'); // Adjust this based on your route setup
      if (slug) {
        this.rescueSlug = slug;
      }

      console.log('Rescue ID:', this.rescueSlug);
      if (this.rescueSlug) {
        this.loadApplications();
      }
    });
  }

  loadApplications() {
    this.adminService.getAllApplicationsForRescue(this.rescueSlug).subscribe({
      next: (response) => {
        console.log('fuck!');
        this.applications = response;
      },
      error: (error) => {
        console.error(
          'Error in retrieving all applications for rescue ',
          error
        );
      },
    });
  }

  viewApplicationDetails(applicationId: string) {
    this.router.navigate(['/admin/rescue/applications', applicationId]);
  }
}
