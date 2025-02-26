import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  public baseUrl = 'https://bettingapp-nodejs.onrender.com/api';
  constructor(public http: HttpClient) {}

  getLiveMatches() {
    return this.http
      .get(`${this.baseUrl}/matches/live`)
      .pipe(map((res) => res))
      .pipe(catchError((error) => error));
  }
}
