import { Component, Input, OnInit } from '@angular/core';
import { Rescue } from '../../../interfaces/rescue';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rescue-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './rescue-card.component.html',
  styleUrl: './rescue-card.component.css',
})
export class RescueCardComponent implements OnInit {
  cardLink: string = '';
  @Input() rescue!: Rescue;
  @Input() userType: 'admin' | 'user' = 'user';

  ngOnInit(): void {
    this.userType == 'admin'
      ? (this.cardLink = this.userType)
      : (this.cardLink = this.userType);
  }
}
