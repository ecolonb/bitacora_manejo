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
import {
  BitacoraPage,
  ConfiguracionServicioPage,
  HomePage,
  LoginPage
} from '../index-paginas';
import { BitacoraProvider } from './../../providers/bitacora/bitacora';
import { UnidadProvider } from './../../providers/unidad/unidad';
import { TabsPage } from './../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  public configuracionServicioPage: any = ConfiguracionServicioPage;
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
    private loadingCtrl: LoadingController,
    private unidadProvider: UnidadProvider
  ) {}
  public goToPage(PageParam: any) {
    this.navCtrl.push(PageParam);
  }
  public cerrarSesion() {
    this.menuController.toggle();
    // Alerta de confirmar
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
              content: 'Sincronizando información, por favor espere...'
            });
            loading.present();
            this.bitacoraProvider.terminarServicio().then(() => {
              this.LoginProvider.cerrarSesion().then(() => {
                loading.dismiss();
                this.app.getRootNavs()[0].setRoot(this.loginPage);
                delete this.bitacoraProvider.BitacoraData;
                // delete this.bitacoraProvider.StatusServicio;
                // delete this.bitacoraProvider.objConfServicio;
                this.LoginProvider.setActivo(false);
                this.bitacoraProvider.strHoras = '00';
                this.bitacoraProvider.strMinutos = ':00';
                this.bitacoraProvider.strSegundos = ':00';
                this.bitacoraProvider.strHorasExcepcion = '00';
                this.bitacoraProvider.strSegundosExcepcion = ':00';
                this.bitacoraProvider.segundosConduccionHhmmss = '00:00:00';
                this.bitacoraProvider.segundosDescansoHhmmss = '00:00:00';
                this.bitacoraProvider.strHorasServicio = '00';
                this.bitacoraProvider.strMinutosServicio = ':00';
                this.bitacoraProvider.strSegundosServicio = ':00';
                this.bitacoraProvider.segundosConduccionStorage = 0;
                this.bitacoraProvider.segundosDescansoStorage = 0;
                this.bitacoraProvider.segundosConduccion = 0;
                this.bitacoraProvider.segundosDescanso = 0;
                this.bitacoraProvider.haveElements = false;
                // this.bitacoraProvider.stora
                this.bitacoraProvider.stExepcionTemporal = false;
                this.bitacoraProvider.ExcepcionTemporal = false;
                this.bitacoraProvider.stInProgress = false;
                this.unidadProvider.cargarFromStorage = true;
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
  public terminarServicio() {
    this.menuController.toggle();
    const confirm = this.alertCtrl.create({
      title: 'Terminar servicio',
      message: '¿Realmente deseas terminar el servicio?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Si',
          handler: () => {
            const loading = this.loadingCtrl.create({
              content: 'Sincronizando información, por favor espere...'
            });
            loading.present();
            this.bitacoraProvider.terminarServicio().then(() => {
              // redirect configuracion nuevo servicio
              loading.dismiss();

              // this.bitacoraProvider.stora
              this.app.getRootNavs()[0].setRoot(this.configuracionServicioPage);
              delete this.bitacoraProvider.BitacoraData;
              // delete this.bitacoraProvider.StatusServicio;
              // delete this.bitacoraProvider.objConfServicio;
              this.bitacoraProvider.strHoras = '00';
              this.bitacoraProvider.strMinutos = ':00';
              this.bitacoraProvider.strSegundos = ':00';
              this.bitacoraProvider.strHorasExcepcion = '00';
              this.bitacoraProvider.strSegundosExcepcion = ':00';
              this.bitacoraProvider.segundosConduccionHhmmss = '00:00:00';
              this.bitacoraProvider.segundosDescansoHhmmss = '00:00:00';
              this.bitacoraProvider.strHorasServicio = '00';
              this.bitacoraProvider.strMinutosServicio = ':00';
              this.bitacoraProvider.strSegundosServicio = ':00';
              this.bitacoraProvider.segundosConduccionStorage = 0;
              this.bitacoraProvider.segundosDescansoStorage = 0;
              this.bitacoraProvider.segundosConduccion = 0;
              this.bitacoraProvider.segundosDescanso = 0;
              this.bitacoraProvider.haveElements = false;
              // this.bitacoraProvider.stora
              this.bitacoraProvider.stExepcionTemporal = false;
              this.bitacoraProvider.ExcepcionTemporal = false;
              this.bitacoraProvider.stInProgress = false;
              this.unidadProvider.cargarFromStorage = true;
            });
          }
        }
      ]
    });
    confirm.present();
  }
}
