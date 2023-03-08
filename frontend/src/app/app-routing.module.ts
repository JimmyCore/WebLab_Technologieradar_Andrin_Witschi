import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup.component';
import { RadarViewerComponent } from './radar-viewer/radar-viewer.component';
import { TechnologieDeatilComponent } from './radar-viewer/technologie-deatil.component';
import { RecordTechnologyComponent } from './radar-viewer/record-technology.component';

const routes: Routes = [
  { path: '', redirectTo: '/log-in', pathMatch: 'full' },
  { path: 'sign-up', component: SignupComponent },
  { path: 'log-in', component: LoginComponent },

  { path: 'radar-viewer', component: RadarViewerComponent, canActivate: [AuthGuard] },
  { path: 'radar-viewer/record', component: RecordTechnologyComponent, canActivate: [AuthGuard] },
  { path: 'radar-viewer/detail/:quadrant', component: TechnologieDeatilComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
