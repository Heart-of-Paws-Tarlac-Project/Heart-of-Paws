import { Component, OnInit } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RescueService } from '../../../services/rescue.service';
import { CommonModule } from '@angular/common';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';

@Component({
  selector: 'app-rescues-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './rescues-list.component.html',
  styleUrl: './rescues-list.component.css',
})
export class RescuesListComponent implements OnInit {
  constructor(private rescueService: RescueService) {}

  ngOnInit(): void {
    this.rescueService.getRescues();
  }

  get rescues() {
    return this.rescueService.rescues$();
  }
}
