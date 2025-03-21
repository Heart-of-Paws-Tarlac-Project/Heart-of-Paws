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
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  private lenis!: Lenis;
  isAdminRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Reset scroll smoothly when navigating to a new page
        if (this.lenis) {
          this.lenis.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminRoute = event.url.startsWith('/admin');
      }
    });
  }

  ngAfterViewInit(): void {
    this.lenis = new Lenis({
      duration: 1.2, // Adjust duration for smoother effect
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // Custom easing
      smoothWheel: true, // Enables smoother scrolling with the mouse wheel
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);
  }

  showFooter(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl !== '/login' &&
      currentUrl !== '/register' &&
      currentUrl !== '/admin-login' &&
      !currentUrl.startsWith('/admin')
    );
  }
}
