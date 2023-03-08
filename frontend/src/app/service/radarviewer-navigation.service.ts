import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RadarviewerNavigationService {

  constructor(private router :Router) { }

  OnNavigateQuadrant(quadrant : number){
    this.router.navigate(['/radar-viewer', 'detail', quadrant]);
  }

  OnNavigateRadarViewer(){
    this.router.navigate(['/radar-viewer']);
  }

  OnNavigateRecorder() {
    this.router.navigate(['/radar-viewer', 'record']);
  }
}
