import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { RescueService } from '../../../services/rescue.service';
import { RescueCardComponent } from '../../ui/rescue-card/rescue-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-rescue-list',
  standalone: true,
  imports: [CommonModule, RescueCardComponent],
  templateUrl: './admin-rescue-list.component.html',
  styleUrl: './admin-rescue-list.component.css',
})
export class AdminRescueListComponent implements OnInit {
  rescueListTitle: string = '';
  hasQuery: boolean = false;
  filteredRescues: any[] = [];
  activeFilter: string = 'all';

  constructor(private rescueService: RescueService, private router: Router) {}

  ngOnInit(): void {
    this.rescueService.getRescues();
  }

  ngAfterViewInit(): void {
    AOS.init();
  }

  sendData(event: any) {
    let query: string = event.target.value;

    //will match if query is nothing or is only spaces
    let matchSpaces: any = query.match(/\s*/);
    if (matchSpaces[0] === query) {
      this.filteredRescues = [];
      this.hasQuery = false;
      return;
    }

    this.rescueService.searchRescues(query.trim()).subscribe((results) => {
      this.filteredRescues = results;
      this.hasQuery = true;
      console.log(results);
    });
  }

  get rescues() {
    return this.rescueService.rescues$();
  }

  filterRescuesBySize(sizeFilter: string) {
    this.activeFilter = sizeFilter;

    if (sizeFilter === 'all') {
      this.rescueService.getRescues();
      return;
    }

    this.rescueService.getRescuesBySize(sizeFilter);
  }

  viewRescueDetails(slug: string) {
    this.router.navigate([`/admin/rescue/${slug}`]);
  }
}
