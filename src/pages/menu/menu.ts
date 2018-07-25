import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { PerfilConductorPage,DetalleViajePage,DatosUnidadPage,MensajesPage,LoginPage,BitacoraPage } from '../index-paginas';
import { LoginProvider } from '../../providers/login/login';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  PerfilConductorPage: any = PerfilConductorPage;
  DetalleViajePage: any = DetalleViajePage;
  DatosUnidadPage: any = DatosUnidadPage;
  MensajesPage: any = MensajesPage;
  BitacoraPage: any = BitacoraPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,private LoginProvider: LoginProvider,public App_: App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }
  goToPage(Page_param:any){
    this.navCtrl.push(Page_param);
    console.log("In go to Page");
  }
  cerrarSesion(){
    this.LoginProvider.setActivo(false);
    //this.navCtrl.setRoot(LoginPage);
    this.App_.getRootNav().setRoot(LoginPage);
  }
}
