import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Technology } from '../Models/technology';
import { AuthService } from '../service/auth.service';
import { RadarviewerNavigationService } from '../service/radarviewer-navigation.service';
import { TechnologieService } from '../service/technologie.service';

@Component({
  selector: 'app-technologie-deatil',
  templateUrl: './technologie-deatil.component.html',
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TechnologieDeatilComponent implements OnInit {

  currentUser = {}
  currentUser_id;
  islocked
  quadrant: any;
  maturities = ['Adopt', 'Trial', 'Assess', 'Hold']
  publishedtechnologies;
  recordedtechnologies;

  changePublishedEventSubject: Subject<Technology> = new Subject<Technology>();
  changeRecordedEventSubject: Subject<Technology> = new Subject<Technology>();
  recordedNewEventSubject: Subject<Technology> = new Subject<Technology>();
  publishEventSubject: Subject<Technology> = new Subject<Technology>();

  buttontext='Erfassen';

  constructor(private router :Router, public route: ActivatedRoute, private technologyService: TechnologieService, private radarNav: RadarviewerNavigationService, public authService: AuthService) {
    this.router.events.subscribe((val) => {
      this.getCurrentUser();
    });
  }

  onSelect(technology: Technology): void {
    // Add the w3-red class to all opened accordions
    var element = document.getElementById(technology.name);
    console.log(technology.name)
    if (element.className.indexOf("w3-show") == -1) {
      element.className += " w3-show";
      element.previousElementSibling.className += " w3-red";
    } else {
      element.className = element.className.replace("w3-show", "");
      element.previousElementSibling.className = element.previousElementSibling.className.replace("w3-red", "");
    }
  }

  emitChangePublishedEvent(technology: Technology) {
    this.changePublishedEventSubject.next(technology);
  }

  emitChangeRecordedEvent(technology: Technology) {
    this.changeRecordedEventSubject.next(technology);
  }

  emitRecordeNewdEvent() {
    this.recordedNewEventSubject.next({});
  }

  emitPublishEvent(technology: Technology) {
    this.publishEventSubject.next(technology);
  }

  getPublishedTechnologies() {
    this.technologyService.getPublishedTechnologiesByCategory(this.quadrantName).subscribe((res) => {
      this.publishedtechnologies = res.msg;
    })
  }

  getRecordedTechnologies() {
    this.technologyService.getRecordedTechnologiesByCategory(this.quadrantName).subscribe((res) => {
      this.recordedtechnologies = res.msg;
    })
  }

  ngOnInit() {
    this.quadrant = this.route.snapshot.paramMap.get('quadrant');
    this.getPublishedTechnologies()
    this.getRecordedTechnologies()
  }

  OnBackToRadarView() {
    this.radarNav.OnNavigateRadarViewer()
  }

  getCurrentUser() {
    this.authService.getUserProfileByToken()
      .subscribe((res) => {
        this.currentUser = res.msg;
        this.currentUser_id = res.msg._id;})
  }

  onRecord() {
    this.buttontext = "Record"
    this.openRecordWindow()
  }

  onModifyPublished(technology: Technology){
    this.buttontext = "Change"
    this.changePublishedEventSubject.next(technology);
    this.openRecordWindow()
  }

  onModifyRecorded(technology: Technology){
    this.buttontext = "Modify"
    this.changeRecordedEventSubject.next(technology);
    this.openRecordWindow();
  }

  onPublish(technology: Technology){
    this.buttontext = "Publish"
    this.publishEventSubject.next(technology);
    this.openRecordWindow()
  }

  onDelete(technology: Technology){
    this.technologyService.deleteTechnology(technology._id)
      .subscribe(res => { location.reload() })
  }

  openRecordWindow() {
    document.getElementById('tech-record').style.display = 'block';
  }

  get quadrantName(): string {
    switch(this.route.snapshot.paramMap.get('quadrant')) {
      case "1":
        return "Techniques";
      case "2":
        return "Tools";
      case "3":
        return "Languages & Frameworks";
      case "4":
        return "Platforms";;
      default: return "";
    }
  }
}

