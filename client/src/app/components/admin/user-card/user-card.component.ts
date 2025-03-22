import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../interfaces/user';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent implements OnInit {
  cardLink: string = '';
  @Input() user!: User;

  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log('fuck you!');
  }

  viewUserDetails(userId: string) {
    this.router.navigate(['/admin/users/user', userId]);
  }
}
