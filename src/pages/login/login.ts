import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Slides
} from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { ConfiguracionPage, MenuPage, TabsPage } from '../index-paginas';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // @ViewChild(Slides) slides: Slides;
  public ConfiguracionPage: any = ConfiguracionPage;
  public myModal = this.ModalController.create(this.ConfiguracionPage);
  public usuario: string = '';
  public contrasenia: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public LoginProvider: LoginProvider,
    private ModalController: ModalController
  ) {}
  public ingresar() {
    // Validar que el la propiedad privada Logged=True; si no mostrar login
    this.navCtrl.setRoot(MenuPage);
  }
  public continuar() {
    let ObjMEnsaje: any;
    const loading = this.loadingCtrl.create({
      content: 'Iniciando la aplicación. Favor de esperar...'
    });
    loading.present();

    this.LoginProvider.validarSesion(this.usuario, this.contrasenia).subscribe(
      (DATARCV) => {
        if (DATARCV) {
          console.log('DATARCV-->', DATARCV);
          ObjMEnsaje = DATARCV;
          console.log('Respuesa-->', ObjMEnsaje);
          if (ObjMEnsaje.error === false) {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: 'HAs inciado como admin',
              title: 'OK',
              buttons: [
                {
                  handler: () => {
                    console.log('Cancelar');
                  },
                  role: 'cancel',
                  text: 'NO'
                },
                {
                  handler: () => {
                    // Guardar en el storage
                    this.LoginProvider.guardarServicio(DATARCV);
                    this.LoginProvider.setActivo(true);
                    console.log('boton OK');
                    // this.slides.lockSwipes(false);
                    // this.slides.slideNext();
                    // this.slides.lockSwipes(true);
                  },
                  role: 'si',
                  text: 'SI'
                }
              ]
            });
            alert.present();
          } else {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: ObjMEnsaje.mensaje,
              buttons: [
                {
                  text: 'Ok',
                  role: 'ok',
                  handler: () => {
                    console.log('boton OK');
                    this.LoginProvider.setActivo(false);
                  }
                }
              ]
            });
            alert.present();
          }
        } else {
          console.log('no hay datos');
          this.LoginProvider.setActivo(false);
        }
      },
      (error) => {
        console.log('Error', error);
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error.message,
          buttons: [
            {
              text: 'Ok',
              role: 'ok',
              handler: () => {
                console.log('boton OK');
                this.LoginProvider.setActivo(false);
              }
            }
          ]
        });
        alert.present();
      }
    );
  }
  public ngAfterViewInit() {
    // this.slides.lockSwipes(true);
    // this.slides.freeMode = false;
    // this.slides.paginationType = 'progress';
  }
  public openConfigModal() {
    this.myModal.present();
  }

  public ionViewDidLoad() {
    console.log('LOGIN PAGE OPEN-->>>');
  }
  public dismissModal() {
    this.myModal.dismiss();
  }
}
