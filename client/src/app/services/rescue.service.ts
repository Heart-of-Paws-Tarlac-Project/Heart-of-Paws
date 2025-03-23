import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //import HTTPCLIENT to make http calls
import { Rescue } from '../interfaces/rescue';
import { ApiService } from './api.service';
import { tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RescueService {
  private url = '/rescues';
  rescues$ = signal<Rescue[]>([]); // signal holds a reactive state of an array of Rescue objects, '([]) means that the signal's value is first set to be an empty array.'

  rescue$ = signal<Rescue>({} as Rescue); // signal holds a reactive state of a single Rescue object, initially an empty object (asserted as Rescue type)

  // The constructor is a special method that is executed when a new instance of the RescueService class is created. It’s part of the Angular dependency injection system.

  constructor(private httpClient: HttpClient, private apiService: ApiService) {} //every instance of this service would now have an instance of httpclient to make requests

  /* refreshRescues() makes an HTTP GET request to fetch a list of rescues from the backend
 and updates the rescues$ signal with the received data.
 It uses the HttpClient to send the request, and once the data is successfully retrieved,
 it subscribes to the observable and updates the rescues$ signal with the new array of Rescue objects,
 ensuring that any component or service subscribing to rescues$ will receive the updated data.*/
  private refreshRescues() {
    this.apiService.get(`${this.url}`).subscribe((rescues) => {
      this.rescues$.set(rescues);
    });
  }

  getRescues() {
    this.refreshRescues();
    return this.rescues$();
  }

  getRescueData(slug: string) {
    return this.apiService.get(`${this.url}/slug`);
  }

  getRescue(slug: string) {
    this.apiService.get(`${this.url}/${slug}`).subscribe((rescue) => {
      this.rescue$.set(rescue);
    });
  }

  /* 
  Sends a POST request to add a new rescue to the backend.
  The 'rescue' object is passed as the payload to the API endpoint.
  The responseType is set to 'text' because we expect a plain text response 
  (such as a success message).
*/
  addRescue(rescue: FormData) {
    return this.apiService.post(`${this.url}/createRescue`, rescue).pipe(
      tap(() => this.refreshRescues()) // Refresh the list after adding
    );
  }

  //apply adoption request for a rescue
  inquireAboutRescue(application: any) {
    return this.apiService.post(
      `/applications/inquire/${application.slug}`,
      application
    );
  }

  updateRescueData(rescueId: string, data: FormData) {
    return this.apiService.patch(`/rescues/${rescueId}`, data);
  }

  getRescueNoOfApplications(slug: string) {
    return this.apiService.get(`${this.url}/${slug}/applications`);
  }

  getRescuesBySize(sizeFilter: string) {
    this.apiService
      .get(`${this.url}/?size=${sizeFilter}`)
      .subscribe((rescues) => {
        this.rescues$.set(rescues);
      });
  }

  getRescuesByAvailability(availFilter: string) {
    this.apiService
      .get(`${this.url}/?availability=${availFilter}`)
      .subscribe((rescues) => {
        this.rescues$.set(rescues);
      });
  }

  loadAvailableDates() {
    return this.apiService.get(`/applications/available-dates`);
  }

  searchRescues(query: string) {
    return this.apiService
      .post(`/rescues/searchRescues`, { payload: query })
      .pipe(map((data) => data.payload));
  }
}
