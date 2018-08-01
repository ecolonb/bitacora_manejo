import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';

registerLocaleData(es);

@IonicPage()
@Component({
  selector: 'page-bitacora',
  templateUrl: 'bitacora.html'
})
export class BitacoraPage {
  public birthday = new Date('2018-07-30T20:00:00');
  // Las fechas se deben guardar de esta forma para evitar errores en Safari-iOS "2018-08-02T19:19:20"
  public fechaBitacora = new Date('2018-07-30T19:19:20');

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private BitacoraProvider: BitacoraProvider
  ) {
    console.log('fechaBitacora: ', this.fechaBitacora);
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad BitacoraPage');
    console.log('BitacoraProvider -> ', this.BitacoraProvider.getBitacora());
    // console.log(JSON.stringify(this.BitacoraProvider.getBitacora()))
  }
}
