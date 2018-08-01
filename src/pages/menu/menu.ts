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

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}
@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  public rootPage: any = TabsPage;
  public BitacoraPage: any = BitacoraPage;
  @ViewChild(Nav) public nav: Nav;
  public pages: PageInterface[] = [
    {
      title: 'Status',
      pageName: 'HomePage',
      tabComponent: HomePage,
      index: 0,
      icon: 'home'
    },
    {
      title: 'Bitácora',
      pageName: 'BitacoraPage',
      tabComponent: BitacoraPage,
      index: 1,
      icon: 'home'
    },
    {
      title: 'ExcepcionTemporal',
      pageName: 'ExcepcionTemporalPage',
      tabComponent: ExcepcionTemporalPage,
      index: 2,
      icon: 'home'
    }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private LoginProvider: LoginProvider,
    public App: App
  ) {}

  public ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
    console.log('In go to Page');
  }
  public cerrarSesion() {
    console.log('Cerrando session fn');
    this.LoginProvider.setActivo(false);
    // this.navCtrl.setRoot(LoginPage);
    this.App.getRootNav().setRoot(LoginPage);
  }
  public testFunction() {
    console.log('testFunction');
  }
}
