import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'; //import HTTPCLIENT to make http calls
import { Rescue } from '../interfaces/rescue';

@Injectable({
  providedIn: 'root',
})
export class RescueService {
  private url = 'http://localhost:3000';
  rescues$ = signal<Rescue[]>([]); // signal holds a reactive state of an array of Rescue objects, '([]) means that the signal's value is first set to be an empty array.'

  rescue$ = signal<Rescue>({} as Rescue); // signal holds a reactive state of a single Rescue object, initially an empty object (asserted as Rescue type)

  // The constructor is a special method that is executed when a new instance of the RescueService class is created. It’s part of the Angular dependency injection system.

  constructor(private httpClient: HttpClient) {} //every instance of this service would now have an instance of httpclient to make requests

  /* refreshRescues() makes an HTTP GET request to fetch a list of rescues from the backend
 and updates the rescues$ signal with the received data.
 It uses the HttpClient to send the request, and once the data is successfully retrieved,
 it subscribes to the observable and updates the rescues$ signal with the new array of Rescue objects,
 ensuring that any component or service subscribing to rescues$ will receive the updated data.*/
  private refreshRescues() {
    this.httpClient
      .get<Rescue[]>(`${this.url}/rescues`)
      .subscribe((rescues) => {
        this.rescues$.set(rescues);
      });
  }

  getRescues() {
    this.refreshRescues(); 
    return this.rescues$();
  }

  getRescue(slug: string) {
    this.httpClient
      .get<Rescue>(`${this.url}/rescues/${slug}`)
      .subscribe((rescue) => {
        this.rescue$.set(rescue);
      });
  }

  /* 
  Sends a POST request to add a new rescue to the backend.
  The 'rescue' object is passed as the payload to the API endpoint.
  The responseType is set to 'text' because we expect a plain text response 
  (such as a success message).
*/
  addRescue(rescue: Rescue) {
    this.httpClient.post(`${this.url}/rescues`, rescue, {
      responseType: 'text',
    });
  }
}
