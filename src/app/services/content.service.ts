import { Injectable } from '@angular/core';
import { ContentEntity } from '../entity/content.entity';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ContentService extends BaseService<ContentEntity> {

  public editObject = new ContentEntity(undefined, undefined, undefined, undefined, undefined);

  constructor(private httpClient: HttpClient) {
    super(httpClient, 'articles');
  }

  public homepage(): Observable<any> {
    return this.doGet('https://storage.googleapis.com/up.roorkee.org/cache/home.json');
  }
}
