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
import { BitacoraProvider } from './../../providers/bitacora/bitacora';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // @ViewChild(Slides) slides: Slides;
  public loading: any = this.loadingCtrl.create({
    content: 'Iniciando la aplicación. Favor de esperar...'
  });
  public ConfiguracionPage: any = ConfiguracionPage;
  public myModal = this.ModalController.create(this.ConfiguracionPage);
  public usuario: string = '';
  public contrasenia: string = '';
  public strLoginOkProvider: string = 'false';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public LoginProvider: LoginProvider,
    private ModalController: ModalController,
    private bitacoraProvider: BitacoraProvider
  ) {
    this.strLoginOkProvider = String(this.LoginProvider.getActivo());
  }
  public ingresar() {
    // Validar que el la propiedad privada Logged=True; si no mostrar login
    if (this.LoginProvider.getActivo()) {
      this.loading.dismiss();
      this.navCtrl.setRoot(MenuPage);
    }
  }
  public continuar(formData: any) {
    this.usuario = formData.usuario.value;
    this.contrasenia = formData.contrasenia.value;
    let ObjMEnsaje: any;
    this.loading = this.loadingCtrl.create({
      content: 'Iniciando la aplicación. Favor de esperar...'
    });
    if (this.usuario === '' || this.contrasenia === '') {
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: '¡Favor de ingresar Usuario y Contraseña!',
        buttons: [
          {
            text: 'Ok',
            role: 'ok',
            handler: () => {
              this.LoginProvider.setActivo(false);
            }
          }
        ]
      });
      alert.present();
      return false;
    } else {
      this.loading.present();
    }

    this.LoginProvider.validarSesion(this.usuario, this.contrasenia).subscribe(
      (DATARCV) => {
        if (DATARCV) {
          ObjMEnsaje = DATARCV;
          if (ObjMEnsaje._error === false) {
            this.LoginProvider.guardarServicio(DATARCV);
            this.LoginProvider.setActivo(true);
            // Promise cargar bitacora y luego ingresar -------------------------------------->>>>>>>>>>>>
            this.bitacoraProvider
              .getBitacoraFromStorage()
              .then((ResultBitacoraStorage) => {
                // this.bitacoraProvider.getHHmmss();
                console.log('ResultBitacoraStorage', ResultBitacoraStorage);
                this.ingresar();
              });
          } else {
            this.loading.dismiss();
            const alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: ObjMEnsaje.mensaje,
              buttons: [
                {
                  text: 'Ok',
                  role: 'ok',
                  handler: () => {
                    this.LoginProvider.setActivo(false);
                  }
                }
              ]
            });
            alert.present();
          }
        } else {
          this.LoginProvider.setActivo(false);
        }
      },
      (error) => {
        this.loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: error.message,
          buttons: [
            {
              text: 'Ok',
              role: 'ok',
              handler: () => {
                this.LoginProvider.setActivo(false);
                // Borrar las dos lineas de abajo
                // this.LoginProvider.setActivo(true);
                // this.ingresar();
              }
            }
          ]
        });
        alert.present();
      }
    );
    return false;
  }
  public ngAfterViewInit() {
    // this.slides.lockSwipes(true);
    // this.slides.freeMode = false;
    // this.slides.paginationType = 'progress';
  }
  public openConfigModal() {
    this.myModal.present();
  }

  public dismissModal() {
    this.myModal.dismiss();
  }
}
