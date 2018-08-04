import { Component, ViewChild } from '@angular/core';
import { App, IonicPage, Nav, NavController, NavParams } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import {
  BitacoraPage,
  ExcepcionTemporalPage,
  HomePage,
  LoginPage
} from '../index-paginas';
import { TabsPage } from './../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  public rootPage: any = TabsPage;
  public BitacoraPage: any = BitacoraPage;
  @ViewChild(Nav) public nav: Nav;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private LoginProvider: LoginProvider,
    public App: App
  ) {}
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
  public cerrarSesion() {
    this.LoginProvider.cerrarSesion().then(() => {
      // this.navCtrl.setRoot(LoginPage);
      // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
      this.App.getRootNavs()[0].setRoot(LoginPage);
    });
  }
  public testFunction() {
    console.log('testFunction');
  }
}
