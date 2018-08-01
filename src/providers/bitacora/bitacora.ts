import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitacoraModel } from '../../models/bitacora.model';

@Injectable()
export class BitacoraProvider {
  // Array donde se guardarán los items de la bitácora
  private BitacoraData: BitacoraModel[] = [];

  constructor(public http: HttpClient) {
    console.log('Hello BitacoraProvider Aqui se inicia el servicio...');
  }
  public setBitacora(objDatos: any) {
    // Modelando la data y guardandola en el array de items bitácora
    const data = new BitacoraModel(objDatos);
    this.BitacoraData.unshift(data);
    console.log(
      'Se ha guardado un elemento en this.BitacoraData --> ',
      this.BitacoraData
    );
  }
  public getBitacora() {
    return this.BitacoraData;
  }
}
