import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../Models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser: any = {};

  endpoint: string = 'http://localhost:8000/auth_api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) {}
}


