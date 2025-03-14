import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  registerUser(user: User): Observable<any> {
    return this.httpClient.post(`${this.url}/auth`, user, {
      responseType: 'text',
    });
  }
}
