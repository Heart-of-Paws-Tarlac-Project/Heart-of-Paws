import { Component, AfterViewInit } from '@angular/core';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  currentIndex = 0;
  interval: any;

  ngOnInit(): void {
    this.startSlideshow(); // Start the slideshow when the component loads
  }

  ngAfterViewInit(): void {
    AOS.init();
  }

  images: string[] = [
    './images/homePage/slideshow1.jpg',
    './images/homePage/slideshow2.jpg',
    './images/homePage/slideshow3.jpg',
    './images/homePage/slideshow4.jpg',
  ];

  startSlideshow() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
