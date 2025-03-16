import { Routes } from '@angular/router';
import { RescuesListComponent } from './components/rescues-list/rescues-list.component';
import { RescueDetailComponent } from './components/rescue-detail/rescue-detail.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HelpComponent } from './components/pages/help/help.component';
import { AboutComponent } from './components/pages/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'rescues',
    component: RescuesListComponent,
  },
  {
    path: 'rescues/:slug',
    component: RescueDetailComponent,
  },
  {
    path: 'howtohelp',
    component: HelpComponent,
  },
  {
    path: 'aboutus',
    component: AboutComponent,
  },
];
