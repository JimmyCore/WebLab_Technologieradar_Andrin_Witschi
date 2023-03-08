import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../Models/user';
import { AuthService } from '../service/auth.service';
import { RadarviewerNavigationService } from '../service/radarviewer-navigation.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  currentUser = {}

  constructor(public authService: AuthService, public userService: UserService, private router :Router) {
    router.events.subscribe((val) => {
      this.getCurrentUser();
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.currentUser = {}
    this.authService.doLogout()
  }

  getuserRole(): string{
    if(this.currentUser['role'] === 1) {
      return "Administrator"
    }
    return "Mitarbeiter"
  }

  getCurrentUser() {
      this.authService.getUserProfileByToken()
        .subscribe((res) => {
          this.currentUser = res.msg;},
          (err) => {
              //this.authService.doLogout();

          })
    }
}
