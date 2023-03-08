import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RadarViewerComponent } from './radar-viewer/radar-viewer.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { TechnologieDeatilComponent } from './radar-viewer/technologie-deatil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './login/signup.component';
import { AuthInterceptor } from './auth/authconfig.interceptor';
import { RecordTechnologyComponent } from './radar-viewer/record-technology.component';

@NgModule({
  declarations: [
    AppComponent,
    RadarViewerComponent,
    LoginComponent,
    HeaderComponent,
    TechnologieDeatilComponent,
    SignupComponent,
    RecordTechnologyComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
