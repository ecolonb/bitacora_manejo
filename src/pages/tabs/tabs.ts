import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import {
  ActividadesPage,
  BitacoraPage,
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
  public tabActividades: any = ActividadesPage;
  public loginActivo: boolean = false;
  public tabIndexVal: number = 1;
  constructor(
    private LoginProvider: LoginProvider,
    private app: App,
    public navCtrl: NavController
  ) {
    this.loginActivo = this.LoginProvider.getActivo();
    // console.log('******** SE CARGARON LOS TABS ***********');
    // const nav = this.app.getRootNav();
    // nav.setRoot(TabsPage, { tabIndex: 2 });
    // this.navCtrl.parent.select(1);
  }
}
