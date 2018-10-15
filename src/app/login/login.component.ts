import { Component,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectorRef
 } from '@angular/core';
import { GoogleSignInSuccess } from 'angular-google-signin';
import { UserEntity } from '../entity/user.entity';
import { UserService } from '../services/user.service';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private myClientId = '670134176077-h5g5nn6catjdo2uoo36d5eji03ccf186.apps.googleusercontent.com';
  @Output() loginEvent = new EventEmitter<UserEntity>();

  public loggedIn = false;
  public loggedInUser: UserEntity;
  public tabChangeEvent: MatTabChangeEvent;

  constructor(
    private userService: UserService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (this.userService.cachedUser != null) {
      this.loggedIn = true;
      this.loggedInUser = this.userService.cachedUser;
    }
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    this.tabChangeEvent = event;
  }

  onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    const googleUser: gapi.auth2.GoogleUser = event.googleUser;
    const id: string = googleUser.getId();
    const profile: gapi.auth2.BasicProfile = googleUser.getBasicProfile();

    const user: UserEntity = new UserEntity(profile.getId(), undefined, undefined, undefined, undefined);

    this.userService.search(user).subscribe(value => {
        if (value.length > 0) {
          this.setLoggedInUserFlags(value[0]);
        } else {
          this.registerUser(profile);
        }
      }, error => {
        if (error) {
          console.log('In error block, registering user');
          this.registerUser(profile);
        }
      }
    );
  }

  setLoggedInUserFlags(user: UserEntity) {
    this.userService.cachedUser = user;
    this.loggedInUser = user;
    this.loggedIn = true;
    this.loginEvent.emit(user);
    this.changeDetectorRef.detectChanges();
  }

  registerUser(profile: gapi.auth2.BasicProfile) {
    const user: UserEntity = new UserEntity(
      profile.getId(),
      profile.getName(),
      profile.getEmail(),
      profile.getImageUrl(),
      'User'
    );
    this.userService.create(user).subscribe(value => {
      if (value) {
        console.log('Registration complete');
        this.setLoggedInUserFlags(user);
      }
    }, error => {
      if (error) {
        console.log ('Could not register the user:' + console.dir(error));
      }
    });
  }
}
