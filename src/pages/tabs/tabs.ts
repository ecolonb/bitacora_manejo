import { Component } from '@angular/core';
import { HomePage, BitacoraPage, MenuPage} from '../index-paginas';
import { LoginProvider } from '../../providers/login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabBitacoraPage= BitacoraPage;
  tabMenuPage = MenuPage;
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
