import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent implements OnInit {
  signinForm: FormGroup;
  constructor(public fb: FormBuilder, public authService: AuthService, public router: Router) {
    this.signinForm = this.fb.group({
      email: [''],
      password: [''],
    });
  }
  ngOnInit() {}

  loginUser() {
    this.authService.signIn(this.signinForm.value);
  }
}
