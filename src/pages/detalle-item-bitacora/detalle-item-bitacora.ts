import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraModel } from '../../models/bitacora.model';
import { BitacoraProvider } from './../../providers/bitacora/bitacora';
registerLocaleData(es);

// ************* Pipes **********
import { DateUtcToLocalePipe } from './../../pipes/date-utc-to-locale/date-utc-to-locale';

@IonicPage()
@Component({
  selector: 'page-detalle-item-bitacora',
  templateUrl: 'detalle-item-bitacora.html'
})
export class DetalleItemBitacoraPage {
  public objItemBitacora: BitacoraModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bitacoraProvider: BitacoraProvider
  ) {
    // se reciben los parametros que se envian
    this.objItemBitacora = this.navParams.get('itemBitacora');
  }

  public ionViewDidLoad() {}
}
