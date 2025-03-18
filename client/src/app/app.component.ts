import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/ui/navbar/navbar.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AdminAuthService } from './services/admin-auth.service';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { AdminNavbarComponent } from './components/admin/ui/admin-navbar/admin-navbar.component';
import { ViewportScroller } from '@angular/common';
import Lenis from '@studio-freight/lenis';

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
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isAdminAuthenticated = false;
  isUserAuthenticated = false;
  private adminAuthSub!: Subscription;
  private userAuthSub!: Subscription;
  private lenis!: Lenis;

  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private authService: AuthService,
    private viewportScroller: ViewportScroller
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]); // Scrolls to top after navigation
      }
    });
  }

  ngOnInit(): void {
    this.adminAuthSub = this.adminAuthService.isAdminAuthenticated$.subscribe(
      (isAdminAuthenticated) => {
        this.isAdminAuthenticated = isAdminAuthenticated;
      }
    );

    this.userAuthSub = this.authService.isAuthenticated$.subscribe(
      (isUserAuthenticated) => {
        this.isUserAuthenticated = isUserAuthenticated;
      }
    );
  }

  ngAfterViewInit(): void {
    this.lenis = new Lenis({
      duration: 1.2, // Adjust duration for smoother effect
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Custom easing
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  ngOnDestroy(): void {
    if (this.adminAuthSub) this.adminAuthSub.unsubscribe();
    if (this.userAuthSub) this.userAuthSub.unsubscribe();
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
