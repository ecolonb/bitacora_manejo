import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BitacoraModel } from '../../models/bitacora.model';
/**
 * Este servicio administra la información de las Bitácoras
 */
@Injectable()
export class BitacoraProvider {
  // Array donde se guardarán los items de la bitácora
  private BitacoraData: BitacoraModel[] = [];

  constructor(public http: HttpClient) {}
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
