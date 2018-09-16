import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  -> Las actividades se muestran desde page bitácora
*/
@Injectable()
export class LocalTimeActivitysProvider {
  constructor(public http: HttpClient) {
    console.log('Hello LocalTimeActivitysProvider Provider');
  }
}
