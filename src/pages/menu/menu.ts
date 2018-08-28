import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  App,
  IonicPage,
  LoadingController,
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
  public loginPage: any = LoginPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private LoginProvider: LoginProvider,
    public app: App,
    private bitacoraProvider: BitacoraProvider,
    private menuController: MenuController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
  public cerrarSesion() {
    this.menuController.toggle();
    // Alerta de confirmar
    console.log('Terminando servicio... Actividades page');
    const confirm = this.alertCtrl.create({
      title: '¿Cerrar sesión?',
      message:
        'Al cerrar sesión, terminaras tu servicio y todas las actividades en progreso. <p>¿Realmente deseas cerrar sesión?</p>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancelar clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            const loading = this.loadingCtrl.create({
              content: 'Sincronizando información, porfavor espere...'
            });
            loading.present();
            this.bitacoraProvider.terminarServicio().then(() => {
              this.LoginProvider.cerrarSesion().then(() => {
                loading.dismiss();
                this.app.getRootNavs()[0].setRoot(this.loginPage);
                delete this.bitacoraProvider.BitacoraData;
                delete this.bitacoraProvider.StatusServicio;
                delete this.bitacoraProvider.objConfServicio;
              });
              // redirect configuracion nuevo servicio
            });
          }
        }
      ]
    });
    confirm.present();

    // this.bitacoraProvider.terminarServicio().then(() => {
    //   this.LoginProvider.cerrarSesion().then(() => {
    //     // this.navCtrl.setRoot(LoginPage);
    //     // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
    //     this.app.getRootNavs()[0].setRoot(LoginPage);
    //   });
    // });
  }
  public testFunction() {
    this.menuController.toggle();
  }
  public closeSideMenu() {
    this.menuController.toggle();
  }
  public borrarBitacora() {
    this.bitacoraProvider.deleteBitacoraDataStorage();
    this.closeSideMenu();
  }
}
