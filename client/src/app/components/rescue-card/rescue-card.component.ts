import { Component, Input } from '@angular/core';
import { Rescue } from '../../interfaces/rescue';

@Component({
  selector: 'app-rescue-card',
  standalone: true,
  imports: [],
  templateUrl: './rescue-card.component.html',
  styleUrl: './rescue-card.component.css',
})
export class RescueCardComponent {
  @Input() rescue!: Rescue;
}
