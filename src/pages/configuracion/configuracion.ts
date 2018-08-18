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
  private serverId: number = 1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private appConfiguracionProvider: AppConfiguracionProvider
  ) {
    try {
      const hobjConfigServer: AppConfiguracionModel = this.appConfiguracionProvider.getConfiguracion();
      this.serverId = hobjConfigServer.serverid;
      this.iButton = String(hobjConfigServer.ibutton);
      if (this.serverId === 1) {
        this.boolServerId1 = true;
        this.boolServerId2 = false;
      } else if (this.serverId === 2) {
        this.boolServerId1 = false;
        this.boolServerId2 = true;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  public closeModalConfiguracion() {
    this.viewCtrl.dismiss();
  }
  public guardarConfiguracion() {
    this.iButton = this.iButton.trim();
    if (this.iButton !== '') {
      // Guardar en Servicio appConfiguracion
      this.appConfiguracionProvider
        .guardarConfigServer(this.serverId, this.iButton)
        .then(() => {
          this.viewCtrl.dismiss();
        });
    } else {
      const alert = this.alertCtrl.create({
        title: 'Atención',
        subTitle: '¡Debes ingresar el IButton!',
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
  public setRadioBtnsServer(serverId: number) {
    this.serverId = serverId;
  }
  public validateIbutton(Evento: any) {
    // Validando caracteres validos
    const strCaracteresValidos: string = '1234567890';
    if (strCaracteresValidos.indexOf(Evento.key) < 0) {
      //      return false;
    }
  }
}
