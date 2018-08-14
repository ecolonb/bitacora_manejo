import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraModel } from '../../models/bitacora.model';

@IonicPage()
@Component({
  selector: 'page-detalle-item-bitacora',
  templateUrl: 'detalle-item-bitacora.html'
})
export class DetalleItemBitacoraPage {
  public objItemBitacora: BitacoraModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // se reciben los parametros que se envian
    console.log('navParams', this.navParams);
    this.objItemBitacora = this.navParams.get('itemBitacora');
  }

  public ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleItemBitacoraPage');
  }
}
