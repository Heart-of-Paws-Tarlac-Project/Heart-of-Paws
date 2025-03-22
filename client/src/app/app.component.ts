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
import { HostListener } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

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

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
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
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      gestureOrientation: 'vertical',
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const observer = new MutationObserver(() => {
      this.lenis.resize();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    this.cdr.detectChanges();
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

  isScrolled = false;
  lastScrollTop = 0;

  @HostListener('window:scroll', [])
  onScroll(): void {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll > 200) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  scrollToTop() {
    this.lenis.scrollTo(0);
  }
}
