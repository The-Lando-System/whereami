import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class StartupService {
  
  constructor(
    private authSvc: AuthService
  ) {}

  load(): Promise<void> {
    return this.authSvc.initUser();
  }

}