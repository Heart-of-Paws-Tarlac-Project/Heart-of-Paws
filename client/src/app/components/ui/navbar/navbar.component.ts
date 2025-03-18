import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit, OnDestroy {
  userId: string = '';
  userProfileSrc: string = '';
  isAuthenticated: boolean = false;
  private authSubscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        console.log('User is authenticated from navbar:', isAuthenticated);
        this.isAuthenticated = isAuthenticated;
        this.userId = localStorage.getItem('userId') || '';
        console.log('User id from navbar: ', this.userId);
        this.getUserProfileImg(this.userId);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(['/']);
        console.log('User successfully logged out');
      },
      error: (error) => {
        console.error('Error in logging out user', error);
      },
    });
  }

  getUserProfileImg(userId: string) {
    this.userService.getUserProfile(userId).subscribe({
      next: (response) => {
        console.log('shit ', response.user.profileImage);
        this.userProfileSrc = response.user.profileImage;
      },
      error: (error) => {
        console.error("Error in retrieving user's profile image.");
        this.userProfileSrc =
          'https://res.cloudinary.com/dydm43ec5/image/upload/v1742289560/profileImages/le0xekv9hluoehypgmsf.png'; //return to default
      },
    });
  }
}
