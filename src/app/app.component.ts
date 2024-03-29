import { Component } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weblab-projekt';

  current: string = 'view';
  loggedin: boolean = false;
  isAdmin: boolean = false;

  constructor(private cookieService: CookieService) {

  }

  ngOnInit() {
    this.checkJWT();
    this.checkAdmin();
  }

  changeView(view: string) {
    this.current = view;
  }

  checkJWT() {
    if (localStorage.getItem('id_token') !== null) {
      this.loggedin = true;
    }
  }
  checkAdmin() {
    axios
      .get('http://localhost:8000/login/verify', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('id_token')
        }
      })
      .then(response => {
        if (response.data.admin) {
          this.isAdmin = true;
        }
      })
  }

  loginAttempt() {
    this.checkJWT();
    this.checkAdmin();
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedin = false;
    this.isAdmin = false;
  }
}
