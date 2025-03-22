import { Component, OnInit, Input } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { RouterLink, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-rescue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rescue-detail.component.html',
  styleUrl: './rescue-detail.component.css',
})
export class RescueDetailComponent implements OnInit {
  @Input() userType: 'admin' | 'user' = 'user';
  buttonPrimaryText: string = '';

  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    AOS.init();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug'); // Extract the slug from the activatedRoute params
      if (slug) {
        this.rescueService.getRescue(slug);
      }

      if (this.userType === 'admin') {
        this.buttonPrimaryText = 'Update';
        return;
      }
      this.buttonPrimaryText = 'Inquire about';
    });
  }

  get rescue() {
    return this.rescueService.rescue$();
  }

  deleteRescue(rescueId: string) {
    this.adminService.deleteRescue(rescueId).subscribe({
      next: () => {
        alert('Rescue successfully deleted');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        alert('Error in deleting rescue');
        this.router.navigate(['/admin']);
      },
    });
  }
}
