import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  @Output() loginAttemptEvent = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
    private router: Router) {

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const data = this.form.value;

    if (data.username && data.password) {
      axios
        .post('http://localhost:8000/login', data)
        .then(response => {
          localStorage.setItem('id_token', response.data.idToken);
          localStorage.setItem('expires_at', JSON.stringify(response.data.expiresIn.valueOf()))
          this.loginAttemptEvent.emit(response.data.success);
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          
        })
    }
  }
}
