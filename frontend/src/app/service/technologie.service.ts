import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';

import { TECHNOLOGIES } from '../Models/mock-tech';
import { Technology } from '../Models/technology';

@Injectable({
  providedIn: 'root'
})

export class TechnologieService implements OnInit{

  private recordEventSource = new BehaviorSubject({});
  onRecordTechnology = this.recordEventSource.asObservable();

  endpoint: string = 'http://localhost:8000/techn_api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  recordTechnology(technology: Technology): Observable<any> {
    let api = `${this.endpoint}/record-technology`;
    return this.http.post(api, technology).pipe(catchError(this.handleError));
  }

  getPublicTechnologies(): Observable<any> {
    let api = `${this.endpoint}/technology/published/all`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
        console.log(res)
         return res || {};
      }), catchError(this.handleError)
    );
  }

  getTechnologyByName(name: string): Observable<any>{
    let api = `${this.endpoint}/technology/name/${name}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  getTechnologyById(id: string): Observable<any>{
    let api = `${this.endpoint}/technology/id/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  getAllTechnologiesByCategory(category: string): Observable<any>{
    let api = `${this.endpoint}/technology/${category}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  getRecordedTechnologiesByCategory(category):  Observable<any> {
    let api = `${this.endpoint}/technology/recorded/${category}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  getPublishedTechnologiesByCategory(category):  Observable<any> {
    let api = `${this.endpoint}/technology/published/${category}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  updateTechnology(technology:Technology): Observable<any> {
    let api = `${this.endpoint}/update-technology`;
    return this.http.put(api, technology).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  deleteTechnology(_id: string): Observable<any> {
    let api = `${this.endpoint}/delete-technology/${_id}`;
    return this.http.delete(api, {headers: this.headers}).pipe(
      map((res) => {
         return res || {};
      }), catchError(this.handleError)
    );
  }

  handleModification(modified: object): Observable<any>  {
    let api = `${this.endpoint}/modified-technology`;
    return this.http.post(api, modified).pipe(catchError(this.handleError));
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
