import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';
import { AppConfiguracionModel } from '../../models/app-configuracion.model';
import { AppConfiguracionProvider } from './../../providers/app-configuracion/app-configuracion';
@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html'
})
export class ConfiguracionPage {
  public boolServerId1: boolean = true;
  public boolServerId2: boolean = false;
  public iButton: string = '--';
  public serverEndPoint: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private appConfiguracionProvider: AppConfiguracionProvider,
    private loadingCtrl: LoadingController
  ) {
    this.serverEndPoint = this.appConfiguracionProvider.ServerEndPoint;
  }

  // Convierte a minuscula cada que se presiona una tecla.
  public toLowerCase() {
    this.serverEndPoint = this.serverEndPoint.toLocaleLowerCase();
  }
  public closeModalConfiguracion() {
    this.viewCtrl.dismiss();
  }
  public guardarConfiguracion() {
    if (this.serverEndPoint !== '') {
      const loadingChkServerendpoint = this.loadingCtrl.create({
        content: 'Validando url...'
      });
      loadingChkServerendpoint.present();
      // Guardar en Servicio appConfiguracion
      this.appConfiguracionProvider
        .guardarConfigServer(this.serverEndPoint)
        .then(() => {
          loadingChkServerendpoint.dismiss();
          this.viewCtrl.dismiss();
        })
        .catch(ErrorData => {
          const alert = this.alertCtrl.create({
            title: 'Atención',
            subTitle:
              '¡La URL que ingresaste no es valida, favor de confirmarla con tu consultor.!',
            buttons: [
              {
                text: 'Ok',
                role: 'ok'
              }
            ]
          });
          loadingChkServerendpoint.dismiss();
          alert.present();
        });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: '¡Debes ingresar la url de tu Desktop virtual!',
        buttons: [
          {
            text: 'Ok',
            role: 'ok'
          }
        ]
      });
      alert.present();
    }
  }
  public validateIbutton(Evento: any) {
    // Validando caracteres validos
    const strCaracteresValidos: string = '1234567890';
    if (strCaracteresValidos.indexOf(Evento.key) < 0) {
      return false;
    }
  }
}
