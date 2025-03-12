import { Component, OnInit, WritableSignal } from '@angular/core';
import { Rescue } from '../../interfaces/rescue';
import { RescueService } from '../../services/rescue.service';
import { CommonModule } from '@angular/common';
import { RescueCardComponent } from '../rescue-card/rescue-card.component';

@Component({
  selector: 'app-rescues-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './rescues-list.component.html',
  styleUrl: './rescues-list.component.css',
})
export class RescuesListComponent implements OnInit {
  rescues$ = {} as WritableSignal<Rescue[]>;

  constructor(private rescueService: RescueService) {}

  ngOnInit(): void {
    this.fetchRescues();
  }

  private fetchRescues(): void {
    this.rescues$ = this.rescueService.rescues$;
    this.rescueService.getRescues();
    console.log(`Rescue data: ${this.rescues$}`);
  }
}
