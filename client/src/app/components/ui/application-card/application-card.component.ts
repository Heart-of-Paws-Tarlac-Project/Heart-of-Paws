import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-application-card',
  standalone: true,
  imports: [],
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css',
})
export class ApplicationCardComponent {
  @Input() rescueImg!: string;
  @Input() rescueName!: string;
  @Input() appointmentMode!: string;
  @Input() noOfApplications!: number;
  @Input() queuePosition!: number;
}
