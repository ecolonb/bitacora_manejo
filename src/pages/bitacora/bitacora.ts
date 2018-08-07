import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { UsuarioProvider } from './../../providers/usuario/usuario';
registerLocaleData(es);

@IonicPage()
@Component({
  selector: 'page-bitacora',
  templateUrl: 'bitacora.html'
})
export class BitacoraPage {
  public birthday = new Date('2018-07-30T20:00:00');
  // Las fechas se deben guardar de esta forma para evitar errores en Safari-iOS "2018-08-02T19:19:20"

  // ******* Metodos publicos
  public fechaBitacora = new Date();
  public strNombreConductor: string;
  public strTiempoManejo: string;
  public strTiempoServicio: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bitacoraProvider: BitacoraProvider,
    public usuarioProvider: UsuarioProvider
  ) {
    this.strNombreConductor = this.usuarioProvider.getNombreConductor();
    this.strTiempoManejo = this.bitacoraProvider.getTimeForBitacora(1);
    this.strTiempoServicio = this.bitacoraProvider.getTimeForBitacora(2);
  }
}
