import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

declare const gapi: any;

@Injectable()
export class AuthService {

  private clientIdUrl = environment.apiUrl + '/google/client-id';
  private logoutUrl = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=' + environment.thisUrl;
  private verifyTokenUrl = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=';

  private user: User;
  private accessToken: string;
  private idToken: string;
  private googleClientId: string;

  constructor(
    private http: HttpClient
  ){}

  initUser(): Promise<void> {

    return new Promise((resolve,reject) => {

      // Get the Google client ID and proceed to token verification
      this.getClientId()
      .then(() => {

        // First see if we have user/token data in local storage
        this.user = this.getUser();
        this.accessToken = this.getAccessToken();
        this.idToken = this.getIdToken();

        // Start from a clean slate if we don't have this data
        if (!this.user || !this.accessToken || !this.idToken) {
          this.clearUserData();
          resolve();
          return;
        }
        
        // Attempt to refresh the id-token
        this.refreshToken()
        .then(() => {

          // Attempt to verify the stored id-token. Clear out the user if this fails
          this.verifyToken(this.idToken)
          .then(() => {
            resolve();
            return;
          })
          .catch(() => {
            this.clearUserData();
            resolve();
            return;
          });

        })
        .catch(() => {
          this.clearUserData();
          resolve();
          return;
        });

      })
      .catch(() => {
        this.clearUserData();
        reject();
        return;
      });

    });

  }

  // Public methods ===============================

  login(): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.getClientId()
      .then(() => {

        this.loadGoogleAuth()
        .then(() => {
          
          this.signIn();
          
          this.listenForAuth()
            .then(() => resolve())
            .catch(() => reject());

        }).catch(() => reject());
      }).catch(() => reject());

    });
  }

  logout(): void {
    this.clearUserData();
    document.location.href = this.logoutUrl;
  }

  getUser(): User {
    return this.user || JSON.parse(localStorage.getItem('currentUser'));
  }

  getAccessToken(): string {
    return this.accessToken || localStorage.getItem('access_token');
  }

  getIdToken(): string {
    return this.idToken || localStorage.getItem('id_token');
  }

  createAuthHeaders(): HttpHeaders {
    return new HttpHeaders ({
      'Content-Type'   : 'application/json',
      'x-id-token' : this.getIdToken()
    });
  }

  // Helper methods ===============================

  private refreshToken(): Promise<any> {
    return new Promise((resolve,reject) => {

      this.loadGoogleAuth()
      .then(() => {

        gapi.auth2.getAuthInstance().currentUser.get()
        .reloadAuthResponse().then((authResponse) => {
          this.idToken = authResponse.id_token;
          resolve();
        }, () => reject());

      }).catch(() => reject());

    });
  }

  private verifyToken(token:string): Promise<any> {
    return new Promise((resolve, reject) => {

      // Check if the token we have is still valid
      this.http.post(this.verifyTokenUrl + token, {})
      .toPromise()
      .then((tokenInfo:any) => {

        if (this.user.email === tokenInfo.email) {
          console.log('Successfully verified the token!')
          resolve();
          return;
        }

        console.log('Failed to verify the token...');
        this.clearUserData();
        reject();
        return;

      }).catch((error:any) => {

        console.log('Failed to verify the access token...');
        console.log(error);
        this.clearUserData();
        reject();
        return;

      });
    });
  }

  private loadGoogleAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: this.googleClientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        }).then(() => {
          resolve();
        }, (err:any) => {
          console.log('Error initializing auth2 client!');
          console.log(err);
          reject();
        });
      }, (err:any) => {
        console.log('Error loading the auth2 client!');
        console.log(err);
        reject();
      });
    });
  }

  private signIn(): void {
    gapi.auth2.getAuthInstance().signIn();
  }

  private listenForAuth(): Promise<void> {
    return new Promise<void>((resolve,reject) => {
      gapi.auth2.getAuthInstance().currentUser.listen((userDetails) => {
        if (!userDetails) {
          console.log('No user details... rejecting')
          reject();
        }

        let profile = userDetails.getBasicProfile();
        if (!userDetails) {
          console.log('No profile in the user details... rejecting');
          reject();
        }

        // Set the user and access token
        this.user = new User(
          profile.getName(),
          profile.getEmail(),
          profile.getImageUrl()
        );
        this.accessToken = userDetails.getAuthResponse().access_token;
        this.idToken = userDetails.getAuthResponse().id_token;
        
        this.storeUserInfo();

        resolve();
      });
    });
  }

  private clearUserData(): void {
    this.user = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }

  private storeUserInfo(): void {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        name: this.user.name,
        email: this.user.email,
        profilePic: this.user.profilePic
      })
    );
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('id_token', this.idToken);
  }

  private getClientId(): Promise<void> {
    return new Promise((resolve, reject) => {
      return this.http.get(this.clientIdUrl)
        .toPromise()
        .then((clientId:string) => {
          this.googleClientId = clientId;
          resolve();
        })
        .catch(err => {
          console.error(err);
          reject();
        });
    });
  }

}

export class User {
  name: string;
  email: string;
  profilePic: string;

  constructor(name:string, email:string, profilePic: string) {
    this.name = name;
    this.email = email;
    this.profilePic = profilePic;
  }
}
