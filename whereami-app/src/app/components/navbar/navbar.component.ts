import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { Broadcaster } from 'src/app/services/broadcaster';

declare var APP_INIT_ERROR;

@Component({
  selector: 'my-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;
  error: boolean = false;

  constructor(
    private authService: AuthService,
    private broadcaster: Broadcaster
  ){}

  ngOnInit(): void {

    if (APP_INIT_ERROR.state) {
      this.error = true;
      return;
    }

    this.user = this.authService.getUser();
  }

  login(): void {
    this.authService.login()
    .then(() => {
      this.user = this.authService.getUser();
      this.broadcaster.broadcast('LOGIN', true);
    })
    .catch(() => {
      // TODO - add navbar error handling
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
