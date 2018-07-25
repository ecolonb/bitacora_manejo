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
  //Array donde se guardarán los items de la bitácora
  private BitacoraData: BitacoraModel[] = [];

  constructor(public http: HttpClient) {
    console.log('Hello BitacoraProvider Aqui se inicia el servicio...');
  }
  setBitacora(objDatos: any){
    //Modelando la data y guardandola en el array de items bitácora
    let data = new BitacoraModel(objDatos);
    this.BitacoraData.unshift(data);
    console.log('Se ha guardado un elemento en this.BitacoraData --> ', this.BitacoraData);
  }
  getBitacora(){
    return this.BitacoraData;
  }
}
