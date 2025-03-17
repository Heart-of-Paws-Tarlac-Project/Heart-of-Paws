import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService) as AuthService; //inject authService
  const router = inject(Router) as Router; //import router

  //   authService.isAuthenticated() sends a request to the server.
  //   The map() operator is applied when the HTTP request is successful (status 200).
  // If the user is authenticated, the server responds with { message: "Authenticated" } and a 200 OK status.
  // The server responds with an error (e.g., 401 Unauthorized or 403 Forbidden).
  // The catchError() is triggered, the user is redirected to the login page, and false is returned, indicating the user is not authenticated.
  return authService.isAuthenticated().pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      localStorage.setItem('redirectUrl', state.url);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
