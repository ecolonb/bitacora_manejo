import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitacoraModel } from '../../models/bitacora.model';

/*
  Generated class for the BitacoraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BitacoraProvider {
  private objBitacora: BitacoraModel[] = [];
  constructor(public http: HttpClient) {
    console.log('Hello BitacoraProvider Provider');
  }

}
