import { Injectable, OnChanges, OnInit } from '@angular/core';
import { User } from '../Models/user';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse,} from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  endpoint: string = 'http://localhost:8000/auth_api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser: User;
  constructor(private http: HttpClient, public router: Router) { }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.endpoint}/register-user`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}/signin`, user).subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        this.getUserProfile(res._id).subscribe((res) => {
          this.router.navigate(['radar-viewer']);
        });
      });
  }

  // User profile
  getUserProfile(token: any): Observable<any> {
    let api = `${this.endpoint}/user-profile/${token}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  // User profile
  getUserProfileByToken(): Observable<any> {
    let token = this.getJWTAccessToken();
    if (token !== null){
      let api = `${this.endpoint}/user-profile/token/${token}`;
      return this.http.get(api, { headers: this.headers }).pipe(
        map((res) => {
          return res || {};
        }),
        catchError(this.handleError)
      );
    }
    return of({})
  }

  getJWTAccessToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    }
    else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(error.status);
  }

}
