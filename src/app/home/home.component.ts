import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../services/content.service';
import { ContentEntity } from '../entity/content.entity';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  contentList: ContentEntity[];
  public uploadServerURL: string;
  public error: boolean;

  constructor(
    private router: Router,
    private contentService: ContentService,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (this.userService.getCachedUser('idtoken') != null) {
      this.userService.getCachedUser('user');
    }

    const searchCriteria = new ContentEntity(undefined, undefined, undefined, undefined, undefined);
    searchCriteria.status = 'published-to-homepage';
    this.contentService.search(searchCriteria).subscribe(data => {
      this.contentList = data;
      this.contentList.sort((obj1, obj2) => {
        if (obj1.priority < obj2.priority) {
          return -1;
        } else {
          return 1;
        }
      });
    }, error => {
        this.error = true;
        console.error(error);
    });
    this.uploadServerURL = environment.uploadServerURL;
  }

  moreBtnClick = function (url: String) {
    this.router.navigateByUrl(url);
  };
}
