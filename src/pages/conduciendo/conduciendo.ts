import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';

@IonicPage()
@Component({
  selector: 'page-conduciendo',
  templateUrl: 'conduciendo.html',
})
export class ConduciendoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private BitacoraProvider: BitacoraProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConduciendoPage');
  }
  guardarBitacora(){
    //Preparando la bitácora para guardarla en el servicio
    let objBitacora = {
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      inicio_x: 19.9990,
      incio_y: -99.0919,
      fin_x: 19.1288,
      fin_y: -99.1918,
      tiempo_hhmmss: "09:08:21",
      tiempo_segundos: 19192
    }

    console.log("Guardando bitacora from Timer",objBitacora);
    this.BitacoraProvider.setBitacora(objBitacora);

  }

}
