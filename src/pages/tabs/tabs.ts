import { Component } from '@angular/core';
import { ConduciendoPage, DescansoPage, BitacoraPage, MenuPage, ServicioPage} from '../index-paginas';
import { LoginProvider } from '../../providers/login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = ConduciendoPage;
  tabBitacoraPage= BitacoraPage;
  tabMenuPage = MenuPage;
  tabConduciendoPage = ConduciendoPage;
  tabDescansoPage = DescansoPage;
  tabServicioPage = ServicioPage;
  public login_activo: boolean = false;

  constructor(private LoginProvider: LoginProvider) {
    console.log("valor activo", this.login_activo);
    console.log("valor this.LoginProvider.activo", this.login_activo);
    this.login_activo = this.LoginProvider.activo;
    console.log("Despues this.login_activo", this.login_activo);
    console.log("DEspues valor this.LoginProvider.activo", this.login_activo);
  }
  ionViewDidLoad() {
    console.log('tabs loading -->>>');
    console.log("Despues this.login_activo", this.login_activo);
  }
}
