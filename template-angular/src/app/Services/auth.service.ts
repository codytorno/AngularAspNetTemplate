import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  PassageUser,
  PassageUserInfo,
} from '@passageidentity/passage-elements/passage-user';
import { authResult } from '@passageidentity/passage-elements/passage-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<PassageUserInfo | undefined>(undefined);
  constructor(private router: Router) {
    this.loadUser();
  }

  public IsUserAuthenticated(): Promise<boolean> {
    var token = this.getToken();
    return token ? new PassageUser(token).authGuard() : Promise.resolve(false);
  }

  public async getAuthToken(): Promise<string> {
    return await new PassageUser().getAuthToken();
  }

  public loadUser(): void {
    // determine if an auth token propery exists
    var token = this.getToken();
    if (token) {
      new PassageUser().userInfo().then((userResult) => {
        this.currentUser$.next(userResult);
      });
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('psg_auth_token');
  }

  public signIn(authResult: authResult) {
    console.log('signing in!');

    // set authtoken in local storage
    localStorage.setItem('psg_auth_token', authResult.auth_token);

    // get current user info
    new PassageUser().userInfo().then((user) => {
      this.currentUser$.next(user);
    });

    // route to user page
    this.router.navigate([authResult.redirect_url]);
  }

  public signOut() {
    // logout of user
    // this will remove all tokens from local storage
    console.log('signing out!');

    if (this.getToken()) {
      new PassageUser().signOut();
    }
    this.currentUser$.next(undefined);
    // route to homepage
    this.router.navigate(['']);
  }
}
