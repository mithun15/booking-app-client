import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpDetails } from './signup-detail';
import { map, Observable, ReplaySubject, shareReplay, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly BASE_URL = 'http://localhost:3000/auth';
  public loggedInUser$: Observable<{ isLoggedIn: boolean; data?: any }>;
  public _loggedInUser$ = new ReplaySubject<{
    isLoggedIn: boolean;
    data?: any;
  }>(1);
  constructor(private _http: HttpClient) {
    this.loggedInUser$ = this._loggedInUser$.asObservable();
    this.getLoggedInUser$(true);
  }

  public signUp(signUpData: SignUpDetails): Observable<{ token: string }> {
    return this._http.post<{ id: string; token: string }>(
      `${this.BASE_URL}/signup`,
      signUpData
    );
  }

  public signIn(signInData: { email: string; password: string }) {
    return this._http.post<{ token: string }>(
      `${this.BASE_URL}/signin`,
      signInData
    );
  }

  public getLoggedInUser$(forceRefresh = false): void {
    if (forceRefresh) {
      this._http
        .get<{ isLoggedIn: boolean; data?: any } | null>(`${this.BASE_URL}/me`)
        .pipe(
          take(1),
          map((res) => {
            if (!res?.isLoggedIn) return null;

            return res?.data;
          })
        )
        .subscribe((data) => {
          this._loggedInUser$.next(data);
        });
    }
  }
}
