import { Component, OnInit } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rescue-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rescue-detail.component.html',
  styleUrl: './rescue-detail.component.css',
})
export class RescueDetailComponent implements OnInit {
  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute
  ) {}

  // ActivatedRoute is a service, that provides route-specific information associated with a component that is loaded in an outlet.

  // we use it to find the route parameter here and resolve it to the getRescue function to initiate a request

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug'); //extract the slug from the activatedRoute params
      if (slug) {
        this.rescueService.getRescue(slug);
      }
    });
  }

  //This getter is doing two important things:
  // It's accessing the rescue$ signal from the rescue service
  // It's calling the signal with () to get its current value
  get rescue() {
    return this.rescueService.rescue$();
  }
}
