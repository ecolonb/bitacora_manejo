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
  public strTiempoManejo: string;
  public strTiempoServicio: string;
  public TimeZone: string;
  public minutosTimeOfSet: number;
  // Constructor
  constructor(
    public navCtrl: NavController,
    public bitacoraProvider: BitacoraProvider,
    private loginProvider: LoginProvider,
    public App: App
  ) {
    this.LoginOkProvider = this.loginProvider.getActivo();
    this.strLoginOkProvider = String(this.LoginOkProvider);
    try {
      const now: Date = new Date();
      const strTime: string = now.toTimeString();
      this.TimeZone = strTime.substring(8, strTime.length);
      console.log('Zona horaria: ', this.TimeZone);
      this.minutosTimeOfSet = now.getTimezoneOffset();
      console.log('timeOfSet: ', this.minutosTimeOfSet);
      console.log('timeOfSet Horas: ', this.minutosTimeOfSet / 60);
    } catch (error) {}
  }

  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
  public ionViewDidLoad() {
    // this.bitacoraProvider.getStatus();
    // setInterval(() => {
    //   this.bitacoraProvider.statusUpdate();
    // }, 1000);
  }
}
