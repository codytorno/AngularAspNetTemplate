import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FitnessApiClient } from '../../../ApiClient/FitnessApiClient';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  results$!: Observable<string>;
  api!: FitnessApiClient;

  constructor(public authService: AuthService, public httpClient: HttpClient) {
    this.api = new FitnessApiClient(httpClient, environment.api);
  }

  ngOnInit(): void {
    this.results$ = this.api.weatherForecast().pipe(
      map((result) => {
        return JSON.stringify(result, null, 2);
      })
    );
  }
}
