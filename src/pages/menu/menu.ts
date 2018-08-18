import { Component, ViewChild } from '@angular/core';
import {
  App,
  IonicPage,
  MenuController,
  Nav,
  NavController,
  NavParams
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { BitacoraPage, HomePage, LoginPage } from '../index-paginas';
import { BitacoraProvider } from './../../providers/bitacora/bitacora';
import { TabsPage } from './../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  public rootPage: any = TabsPage;
  public BitacoraPage: any = BitacoraPage;
  @ViewChild(Nav)
  public nav: Nav;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private LoginProvider: LoginProvider,
    public app: App,
    private bitacoraProvider: BitacoraProvider,
    private menuController: MenuController
  ) {}
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
  public cerrarSesion() {
    this.LoginProvider.cerrarSesion().then(() => {
      // this.navCtrl.setRoot(LoginPage);
      // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
      this.app.getRootNavs()[0].setRoot(LoginPage);
    });
  }
  public testFunction() {
    this.menuController.toggle();
    console.log('testFunction');
  }
  public closeSideMenu() {
    this.menuController.toggle();
  }
  public borrarBitacora() {
    console.log('Borrando bitácora');
    this.bitacoraProvider.deleteBitacoraDataStorage();
    this.closeSideMenu();
  }
}
