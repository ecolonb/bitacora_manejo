import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Slides } from 'ionic-angular';
import { TabsPage } from '../index-paginas';
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  @ViewChild(Slides) slides: Slides;
  usuario:string = '';
  contrasenia:string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private loadingCtrl: LoadingController,public LoginProvider:LoginProvider) {
  }

  ionViewDidLoad() {
    console.log('LOGIN PAGE OPEN-->>>');
    
  }
  ingresar(){
    //Validar que el la propiedad privada Logged=True; si no mostrar login
    this.navCtrl.setRoot( TabsPage );
  }
  continuar(){
    let ObjMEnsaje: any;
    let loading = this.loadingCtrl.create({
      content: 'Iniciando la aplicación. Favor de esperar...'
    });
    loading.present();

    this.LoginProvider.validarSesion(this.usuario,this.contrasenia).subscribe((DATARCV)=>{
      if(DATARCV){
        console.log('DATARCV-->',DATARCV);
      ObjMEnsaje = DATARCV;
      console.log('Respuesa-->',ObjMEnsaje);
      if (ObjMEnsaje.error == false) {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'OK',
          subTitle: 'HAs inciado como admin',
          buttons: [
            {
              text: 'NO',
              role: 'cancel',
              handler: ()=> {
                console.log('Cancelar');
              }
            },{
              text: 'SI',
              role: 'si',
              handler: ()=> {
                //Guardar en el storage
                this.LoginProvider.guardarServicio(DATARCV);
                this.LoginProvider.setActivo(true);
                console.log('boton OK');
                this.slides.lockSwipes(false);
                this.slides.slideNext();
                this.slides.lockSwipes(true);
              }
            }
          ]
        });
        alert.present();
      }else{
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: ObjMEnsaje.mensaje,
          buttons: [{
              text: 'Ok',
              role: 'ok',
              handler: ()=> {
                console.log('boton OK');
                this.LoginProvider.setActivo(false);
              }
            }]
        });
        alert.present();
      }
      }else{
        console.log('no hay datos');
        this.LoginProvider.setActivo(false);
      }


    },(error)=>{
      console.log('Error',error);
      loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error.message,
          buttons: [{
              text: 'Ok',
              role: 'ok',
              handler: ()=> {
                console.log('boton OK');
                this.LoginProvider.setActivo(false);
              }
            }]
        });
        alert.present();
    });
  }

  ngAfterViewInit(){

    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = "progress";

  }
}
