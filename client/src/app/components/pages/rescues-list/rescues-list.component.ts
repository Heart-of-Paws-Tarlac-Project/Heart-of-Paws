import { Component, OnInit, Input } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { CommonModule } from '@angular/common';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-rescues-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './rescues-list.component.html',
  styleUrl: './rescues-list.component.css',
})
export class RescuesListComponent implements OnInit {
  rescueListTitle: string = '';
  activeFilter: string = 'all';

  constructor(private rescueService: RescueService) {}
  ngOnInit(): void {
    this.rescueService.getRescues();
  }
  ngAfterViewInit(): void {
    AOS.init();
  }
  get rescues() {
    return this.rescueService
      .rescues$()
      .filter((rescue) => rescue.availability !== 'adopted');
  }

  filterRescuesBySize(sizeFilter: string) {
    this.activeFilter = sizeFilter;

    if (sizeFilter === 'all') {
      this.rescueService.getRescues();
      return;
    }

    this.rescueService.getRescuesBySize(sizeFilter);
  }
}
