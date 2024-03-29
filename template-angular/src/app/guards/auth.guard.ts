import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.IsUserAuthenticated().then((isAuthenticated) => {
    if (isAuthenticated) {
      console.log('AuthGuard Allow');
    } else {
      console.log('AuthGard Deny');
      router.navigate(['']);
    }
    return isAuthenticated;
  });
};
