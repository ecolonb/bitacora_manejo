import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
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
    private appConfiguracionProvider: AppConfiguracionProvider
  ) {
    this.serverEndPoint = this.appConfiguracionProvider.ServerEndPoint;
    console.log(
      'this.serverEndPoint from constructor:-->',
      this.serverEndPoint
    );
  }

  // Convierte a minuscula cada que se presiona una tecla.
  public toLowerCase() {
    this.serverEndPoint = this.serverEndPoint.toLocaleLowerCase();
  }
  public closeModalConfiguracion() {
    this.viewCtrl.dismiss();
  }
  public guardarConfiguracion() {
    console.log('Aqui guardar serverEndPoint');
    if (this.serverEndPoint !== '') {
      // Guardar en Servicio appConfiguracion
      this.appConfiguracionProvider
        .guardarConfigServer(this.serverEndPoint)
        .then(() => {
          console.log('Se guardo la config del serverEndPoint');
          this.viewCtrl.dismiss();
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
