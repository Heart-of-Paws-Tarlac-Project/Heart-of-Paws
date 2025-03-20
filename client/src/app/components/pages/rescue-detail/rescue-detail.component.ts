import { Component, OnInit, Input } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rescue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rescue-detail.component.html',
  styleUrl: './rescue-detail.component.css',
})
export class RescueDetailComponent implements OnInit {
  @Input() userType: 'admin' | 'user' = 'user';

  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute
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
    });
  }

  get rescue() {
    return this.rescueService.rescue$();
  }
}
