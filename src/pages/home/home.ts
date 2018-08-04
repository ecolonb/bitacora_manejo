import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { LoginProvider } from '../../providers/login/login';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public LoginPage: any = LoginPage;
  public strPosition: string = '';
  public LoginOkProvider: boolean = false;
  public strLoginOkProvider: string = 'false';
  // Constructor
  constructor(
    public navCtrl: NavController,
    private BitacoraProvider: BitacoraProvider,
    private loginProvider: LoginProvider,
    public App: App
  ) {
    this.LoginOkProvider = this.loginProvider.getActivo();
    this.strLoginOkProvider = String(this.LoginOkProvider);
  }
  public guardarBitacora() {
    // Preparando la bitácora para guardarla en el servicio
    const objBitacora = {
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      inicio_x: 19.999,
      incio_y: -99.0919,
      fin_x: 19.1288,
      fin_y: -99.1918,
      tiempo_hhmmss: '09:08:21',
      tiempo_segundos: 19192
    };
    this.BitacoraProvider.setBitacora(objBitacora);
  }
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
}
