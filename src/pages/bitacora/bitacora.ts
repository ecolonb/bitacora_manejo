import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';

/**
 * Generated class for the BitacoraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bitacora',
  templateUrl: 'bitacora.html',
})
export class BitacoraPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private BitacoraProvider: BitacoraProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BitacoraPage');
    console.log('BitacoraProvider -> ',this.BitacoraProvider.getBitacora());
    //console.log(JSON.stringify(this.BitacoraProvider.getBitacora()))
  }


}
