import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RadarviewerNavigationService } from '../service/radarviewer-navigation.service';
import { Validators } from '@angular/forms';
import { TechnologieService } from '../service/technologie.service';
import { Technology } from '../Models/technology';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-record-technology',
  templateUrl: './record-technology.component.html',
  styles: [
    'div {color: rgb(0, 0, 0);} p {margin: 15px}'
  ]
})
export class RecordTechnologyComponent {

  private changePublishedEventSubscription: Subscription;
  private changeRecordedEventSubscription: Subscription;
  private publishEventSubscription: Subscription;
  private recordNewEventEventSubscription: Subscription;



  namerequired: boolean = false;
  categoryrequired: boolean = false;
  ringrequired: boolean = false;
  description_technologyrequired: boolean = false;
  description_classificationrequired: boolean = false;
  selectedTechnology;

  current_uid;
  @Input() buttontext: string = "Record"
  @Input() changePublishedEvent: Observable<Technology>;
  @Input() changeRecordedEvent: Observable<Technology>;
  @Input() publishEvent: Observable<Technology>;
  @Input() recordNewEvent: Observable<Technology>;

  technoForm = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    ring: [''],
    description_technology: ['', Validators.required],
    description_classification: ['']
  })

  constructor(private authService: AuthService,private techService: TechnologieService, private fb: FormBuilder, private radarNav: RadarviewerNavigationService) {
    this.getCurrentUser_id()
  }

  ngOnInit(){
    this.changePublishedEventSubscription = this.changePublishedEvent.subscribe((res) => this.onChangePublished(res));
    this.changeRecordedEventSubscription = this.changeRecordedEvent.subscribe((res) => this.onChangeRecorded(res));
    this.publishEventSubscription = this.publishEvent.subscribe((res) => this.onPublish(res));
    this.recordNewEventEventSubscription = this.recordNewEvent.subscribe((res) => this.onRecordNew());
  }

  getCurrentUser_id() {
    this.authService.getUserProfileByToken()
      .subscribe((res) => {
        this.current_uid = res.msg._id;})
  }

  onChangePublished(technology: Technology) {
    this.selectedTechnology = technology;
    this.setFromvalues(technology);
    this.setAllRequired();
    this.availabilityInputModifyPublished();
  }

  onChangeRecorded(technology: Technology) {
    this.selectedTechnology = technology;
    this.clearAllRequired()
    this.setFromvalues(technology);
    this.availabilityInputModifyRecorded();
    this.setRequiredForRecord();
  }

  onPublish(technology: Technology) {
    this.selectedTechnology = technology;
    this.setAllRequired();
    this.setFromvalues(technology);
    this.availabilityInputModifyRecorded();
  }

  onRecordNew() {
    this.technoForm.reset();
    this.setRequiredForRecord();
    this.enableinputAll();
  }

  setAllRequired(){
    this.namerequired = true;
    this.categoryrequired = true;
    this.ringrequired = true;
    this.description_technologyrequired = true;
    this.description_classificationrequired = true;
  }

  clearAllRequired() {
    this.namerequired = false;
    this.categoryrequired = false;
    this.ringrequired = false;
    this.description_technologyrequired = false;
    this.description_classificationrequired = false;
  }

  setRequiredForRecord() {
    this.namerequired, this.categoryrequired, this.description_technologyrequired = true;
    this.ringrequired, this.description_technologyrequired = false;
  }

  availabilityInputModifyRecorded(){
    this.enableinputAll();
  }

  availabilityInputModifyPublished(){
    this.disableinputName();
    this.disableinputCategory();
    this.disableinputDescriptionTechnology();
    this.enableinputRing();
    this.enableinputDescriptionClassification();
  }

  onSubmit() {
    switch(this.buttontext){
      case "Record":
        this.recordTechnologysubmit()
        break
      case "Change":
        this.changeClassificationsubmit()
        break
      case "Modify":
        this.modifyRecordedTechnologysubmit()
        break
      case "Publish":
        this.publishTechnologysubmit()
        break
      default:
        break
    }
  }

  recordTechnologysubmit() {
    this.techService.recordTechnology(this.technoForm.value).subscribe((res) => {
      if (res.result) {
        this.techService.handleModification({_id: this.current_uid, action:'recorded'}).subscribe((res) => {})
        this.technoForm.reset();
      }
    });
  }

  modifyRecordedTechnologysubmit(){
    this.techService.getTechnologyById(this.selectedTechnology._id).subscribe((res) => {
      if (res.msg) {
        let updatedtechnology = {
          _id: res.msg._id,
          name: this.technoForm.value.name,
          category: this.technoForm.value.category,
          ring: this.technoForm.value.ring,
          description_technology: this.technoForm.value.description_technology,
          description_classification: this.technoForm.value.description_classification,
        }
        this.techService.updateTechnology(updatedtechnology).subscribe((res) => {
          this.techService.handleModification({_id: this.current_uid, action:'change_recorded'}).subscribe((res) => {})
          location.reload();
        });
      }
    });
  }

  changeClassificationsubmit(){
    this.techService.getTechnologyById(this.selectedTechnology._id).subscribe((res) => {
      if (res.msg) {
        console.log(res.msg.classification_history)
        let updatedclassifications = res.msg.classification_history
        if (this.technoForm.value.ring !== this.selectedTechnology.ring){
          updatedclassifications.push(this.technoForm.value.ring)
        }
        let updatedtechnology = {
          _id: res.msg._id,
          name: this.technoForm.value.name,
          category: this.technoForm.value.category,
          ring: this.technoForm.value.ring,
          description_technology: this.technoForm.value.description_technology,
          description_classification: this.technoForm.value.description_classification,
          classification_history: updatedclassifications
        }
        this.techService.updateTechnology(updatedtechnology).subscribe((res) => {
          this.techService.handleModification({_id: this.current_uid, action:'change_category'}).subscribe((res) => {})
          //location.reload();
        });
      }
    });
  }

  publishTechnologysubmit() {
    this.techService.getTechnologyById(this.selectedTechnology._id).subscribe((res) => {
      if (res.msg) {
        let updatedtechnology = {
          _id: res.msg._id,
          name: this.technoForm.value.name,
          category: this.technoForm.value.category,
          ring: this.technoForm.value.ring,
          description_technology: this.technoForm.value.description_technology,
          description_classification: this.technoForm.value.description_classification,
          published:true
        }
        this.techService.updateTechnology(updatedtechnology).subscribe((res) => {
          this.techService.handleModification({_id: this.current_uid, action:'published'}).subscribe((res) => {})
          location.reload();
        });
      }
    });
  }

  disableinputAll(){
    this.disableinputName();
    this.disableinputCategory();
    this.disableinputRing();
    this.disableinputDescriptionClassification();
    this.disableinputDescriptionTechnology();
  }

  disableinputName() {
    this.technoForm.controls['name'].disable();
  }

  disableinputCategory() {
    this.technoForm.controls['category'].disable();
  }

  disableinputRing() {
    this.technoForm.controls['ring'].disable();
  }

  disableinputDescriptionClassification() {
    this.technoForm.controls['description_classification'].disable();
  }

  disableinputDescriptionTechnology() {
    this.technoForm.controls['description_technology'].disable();
  }

  enableinputAll(){
    this.enableinputName();
    this.enableinputCategory();
    this.enableinputRing();
    this.enableinputDescriptionClassification();
    this.enableinputDescriptionTechnology();
  }

  enableinputName() {
    this.technoForm.controls['name'].enable();
  }

  enableinputCategory() {
    this.technoForm.controls['category'].enable();
  }

  enableinputRing() {
    this.technoForm.controls['ring'].enable();
  }

  enableinputDescriptionClassification() {
    this.technoForm.controls['description_classification'].enable();
  }

  enableinputDescriptionTechnology() {
    this.technoForm.controls['description_technology'].enable();
  }

  setFromvalues(technology: Technology) {
    this.technoForm.setValue({
      name: technology.name,
      category: technology.category,
      ring: technology.ring == null ? '' : technology.ring,
      description_technology: technology.description_technology == null ? '' : technology.description_technology,
      description_classification: technology.description_classification
   });
  }

  OnBackToRadarView() {
    this.radarNav.OnNavigateRadarViewer()
  }

  ngOnDestroy() {
    this.changePublishedEventSubscription.unsubscribe();
    this.changeRecordedEventSubscription.unsubscribe();
    this.publishEventSubscription.unsubscribe();
    this.recordNewEventEventSubscription.unsubscribe();
  }
}
