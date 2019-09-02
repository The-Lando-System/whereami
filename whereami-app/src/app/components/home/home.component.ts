import { Component, OnInit } from '@angular/core';
import { AuthService, User } from 'src/app/services/auth.service';
import { Broadcaster } from 'src/app/services/broadcaster';

declare var APP_INIT_ERROR;

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
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
    this.listenForLogin();
  }

  listenForLogin(): void {
    this.broadcaster.on("LOGIN").subscribe(() => {
      this.user = this.authService.getUser();
    });
  }
}
