import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminAuthService } from './services/admin-auth.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { AdminNavbarComponent } from './components/admin/ui/admin-navbar/admin-navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    AdminNavbarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  isAdminAuthenticated = false;
  isUserAuthenticated = false;
  private adminAuthSub!: Subscription;
  private userAuthSub!: Subscription;

  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.adminAuthSub = this.adminAuthService.isAdminAuthenticated$.subscribe(
      (isAdminAuthenticated) => {
        console.log('Admin is authenticated from app: ', isAdminAuthenticated);
        this.isAdminAuthenticated = isAdminAuthenticated;
      }
    );

    this.userAuthSub = this.authService.isAuthenticated$.subscribe(
      (isUserAuthenticated) => {
        console.log('User is authenticated from app: ', isUserAuthenticated);
        this.isUserAuthenticated = isUserAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.adminAuthSub) {
      this.adminAuthSub.unsubscribe();
    }

    if (this.userAuthSub) {
      this.userAuthSub.unsubscribe();
    }
  }

  showFooter(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl !== '/login' &&
      currentUrl !== '/register' &&
      currentUrl !== '/admin-login'
    );
  }
}
