import { Component, Input, OnInit } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RescueService } from '../../../services/rescue.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rescue-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './rescue-card.component.html',
  styleUrl: './rescue-card.component.css',
})
export class RescueCardComponent implements OnInit {
  cardLink: string = '';
  applicationCount: number = 0;

  @Input() rescue!: Rescue;
  @Input() userType: 'admin' | 'user' = 'user';

  constructor(private rescueService: RescueService) {}

  ngOnInit(): void {
    this.cardLink =
      this.userType === 'admin'
        ? `/admin/rescue/${this.rescue.slug}`
        : `/rescues/${this.rescue.slug}`;

    if (this.userType === 'admin') {
      this.rescueService.getRescueNoOfApplications(this.rescue.slug).subscribe({
        next: (response) => {
          console.log(`response: ${response.applicationCount}`);
          this.applicationCount = response.applicationCount;
        },
        error: (error) => {
          console.error('Error in retrieving application count: ', error);
        },
      });
    }
  }
}
