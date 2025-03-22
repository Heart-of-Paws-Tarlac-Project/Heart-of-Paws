import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { RescueService } from '../../../services/rescue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../ui/dialog/dialog.component';

@Component({
  selector: 'app-rescue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, MatDialogModule],
  templateUrl: './rescue-detail.component.html',
  styleUrl: './rescue-detail.component.css',
})
export class RescueDetailComponent implements OnInit, AfterViewInit {
  @Input() userType: 'admin' | 'user' = 'user';
  buttonPrimaryText: string = '';

  constructor(
    private rescueService: RescueService,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    AOS.init();
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.rescueService.getRescue(slug);
      }

      this.buttonPrimaryText =
        this.userType === 'admin' ? 'Update' : 'Inquire about';
    });
  }

  get rescue() {
    return this.rescueService.rescue$();
  }

  confirmDelete(rescueId: string) {
    const data = {
      modalTitle: 'Confirm Deletion',
      modalDesc: 'Are you sure you want to delete this rescue?',
      yes: 'Yes',
      no: 'No',
    };

    console.log('Opening Dialog with Data:', data); // Debugging

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: data,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      console.log('Dialog closed:', confirmed);
      if (confirmed) {
        this.deleteRescue(rescueId);
      }
    });
  }

  deleteRescue(rescueId: string) {
    this.adminService.deleteRescue(rescueId).subscribe({
      next: () => {
        alert('Rescue successfully deleted');
        this.router.navigate(['/admin']);
      },
      error: () => {
        alert('Error in deleting rescue');
        this.router.navigate(['/admin']);
      },
    });
  }
}
