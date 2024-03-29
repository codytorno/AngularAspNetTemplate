import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { AuthService } from '../Services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // if your getAuthToken() function declared as "async getAuthToken() {}"
  var authService = inject(AuthService);

  console.log('interceptor triggered!');
  return from(authService.getAuthToken()).pipe(
    switchMap((token) => {
      let authReq = request.clone({
        setHeaders: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return next(authReq);
    })
  );
};
