import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RescueService } from '../../../services/rescue.service';
import { RescueDetailComponent } from '../../pages/rescue-detail/rescue-detail.component';
import { RescueApplicationsComponent } from '../rescue-applications/rescue-applications.component';

@Component({
  selector: 'app-rescue-overview',
  standalone: true,
  imports: [RescueDetailComponent, RescueApplicationsComponent],
  templateUrl: './rescue-overview.component.html',
  styleUrl: './rescue-overview.component.css',
})
export class RescueOverviewComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private rescueService: RescueService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.rescueService.getRescue(slug);
      }
    });
  }

  get rescue() {
    return this.rescueService.rescue$();
  }
}
