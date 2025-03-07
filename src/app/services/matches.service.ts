import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {
  public baseUrl = 'https://bettingapp-nodejs.onrender.com/api';
  constructor(public http: HttpClient) {}

  /**
   * Fetches live cricket matches from the CricAPI.
   *
   * @returns An Observable containing the current matches data.
   *          In case of an error, the Observable will contain the error.
   */

  getLiveMatches() {
    return this.http
      .get(
        `https://api.cricapi.com/v1/currentMatches?apikey=${environment.CRIC_API_KEY}&offset=0`
      )
      .pipe(map((res: any) => res?.data))
      .pipe(catchError((error) => error));
  }
}
