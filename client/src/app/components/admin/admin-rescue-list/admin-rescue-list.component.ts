import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { RescueService } from '../../../services/rescue.service';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';

@Component({
  selector: 'app-admin-rescue-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './admin-rescue-list.component.html',
  styleUrl: './admin-rescue-list.component.css',
})
export class AdminRescueListComponent implements OnInit {
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
    return this.rescueService.rescues$();
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
