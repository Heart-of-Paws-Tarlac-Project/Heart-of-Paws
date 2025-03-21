import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interfaces/user';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

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
  isDropdownOpen = false;
  private authSubscription: Subscription | null = null;

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownButton') dropdownButton!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  handleNavigation() {
    this.closeMenu();
    this.closeDropdown();
  }

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

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
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
        this.isDropdownOpen = false;
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

  navigateToUserProfile() {
    this.router.navigate(['user', this.userId]);
    this.isDropdownOpen = false;
  }
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    // If dropdown is open, check if click is inside dropdown or button
    if (
      this.isDropdownOpen &&
      this.dropdownMenu &&
      this.dropdownButton &&
      !this.dropdownMenu.nativeElement.contains(event.target) &&
      !this.dropdownButton.nativeElement.contains(event.target)
    ) {
      this.closeDropdown();
    }
  }

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50; // Adjust the scroll value as needed
  }
}
