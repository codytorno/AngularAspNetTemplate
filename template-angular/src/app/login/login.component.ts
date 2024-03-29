import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import '@passageidentity/passage-elements/passage-auth';
import {
  PassageElement,
  authResult,
} from '@passageidentity/passage-elements/passage-auth';
import { AuthService } from '../Services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  appId: string = environment.passage.appId;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const passageAuth = document.querySelector(
      'passage-auth'
    ) as PassageElement;
    passageAuth.onSuccess = this.onSuccess;
  }

  public onSuccess = async (authResult: authResult) => {
    console.log('AuthResult:', authResult);
    this.authService.signIn(authResult);
  };
}
