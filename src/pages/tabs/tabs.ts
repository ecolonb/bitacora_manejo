import { Component } from '@angular/core';
import { LoginProvider } from '../../providers/login/login';
import {
  BitacoraPage,
  ExcepcionTemporalPage,
  HomePage,
  MenuPage
} from '../index-paginas';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  public tabHome: any = HomePage;
  public tabBitacoraPage: any = BitacoraPage;
  public tabMenuPage: any = MenuPage;
  public tabExcepcionTemporalPage: any = ExcepcionTemporalPage;
  public loginActivo: boolean = false;

  constructor(private LoginProvider: LoginProvider) {
    console.log('valor activo', this.loginActivo);
    console.log('valor this.LoginProvider.activo', this.loginActivo);
    this.loginActivo = this.LoginProvider.activo;
    console.log('Despues this.login_activo', this.loginActivo);
    console.log('DEspues valor this.LoginProvider.activo', this.loginActivo);
  }
  public ionViewDidLoad() {
    console.log('tabs loading -->>>');
    console.log('Despues this.login_activo', this.loginActivo);
  }
}
