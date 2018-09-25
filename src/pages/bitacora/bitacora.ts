import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
registerLocaleData(es);

// *** Models */
import { BitacoraModel } from './../../models/bitacora.model';

/* *********** Pages */
import { DetalleItemBitacoraPage } from './../index-paginas';

// ************* Providers *******
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { ConductorProvider } from '../../providers/conductor/conductor';
import { LocalTimeActivitysProvider } from '../../providers/local-time-activitys/local-time-activitys';
import { UsuarioProvider } from './../../providers/usuario/usuario';

// ************* Pipes **********
import { ActividadProgressTitlePipe } from './../../pipes/actividad-progress-title/actividad-progress-title';
import { ActividadTitlePipe } from './../../pipes/actividad-title/actividad-title';
import { DateUtcToLocalePipe } from './../../pipes/date-utc-to-locale/date-utc-to-locale';
import { TipoServicoTranslatePipe } from './../../pipes/tipo-servico-translate/tipo-servico-translate';
import { SecondsToHhmmssPipe } from './../../pipes/seconds-to-hhmmss/seconds-to-hhmmss';

@IonicPage()
@Component({
  selector: 'page-bitacora',
  templateUrl: 'bitacora.html'
})
export class BitacoraPage {
  // Las fechas se deben guardar de esta forma para evitar errores en Safari-iOS "2018-08-02T19:19:20"

  // ******* Propiedades públicas
  public fechaBitacora = new Date();
  public strNombreConductor: string;
  public strTiempoManejo: string;
  public strTiempoServicio: string;
  public ObjItemsConduciendo: BitacoraModel[];
  public ObjItemsDescansos: BitacoraModel[];
  public ObjItemsExcepcion: BitacoraModel[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public bitacoraProvider: BitacoraProvider,
    public usuarioProvider: UsuarioProvider,
    public conductorProvider: ConductorProvider,
    public localTimeActivitysProvider: LocalTimeActivitysProvider
  ) {}

  //
  public ionViewDidLoad() {
    this.localTimeActivitysProvider
      .getDataFromServer(false)
      .then(ResposeData => {})
      .catch(ErrorRequest => {});
  }
  // ionViewWillEnter Aqui separar actividades
  public ionViewWillEnter() {
    this.ObjItemsConduciendo = [];
    this.ObjItemsDescansos = [];
    this.ObjItemsExcepcion = [];
    this.separateActivitys();
  }

  // Abre otra pagina con parametros
  public goToDetalles(itemBitacora: BitacoraModel) {
    this.navCtrl.push(DetalleItemBitacoraPage, { itemBitacora });
  }

  // Las actividades se separan cuando se entra a bitácora y cada que se agrega una nueva Actividad.
  public separateActivitys() {
    try {
      if (
        this.bitacoraProvider.BitacoraData &&
        this.bitacoraProvider.BitacoraData !== null &&
        this.bitacoraProvider.BitacoraData !== undefined
      ) {
        for (const ietmBitacora of this.bitacoraProvider.BitacoraData) {
          if (ietmBitacora.Actividad === 'C') {
            this.ObjItemsConduciendo.push(ietmBitacora);
          }
          if (ietmBitacora.Actividad === 'D') {
            this.ObjItemsDescansos.push(ietmBitacora);
          }
          if (ietmBitacora.Actividad === 'ET') {
            this.ObjItemsExcepcion.push(ietmBitacora);
          }
        }
      }
    } catch (error) {
      console.log('In error catch error', error);
    }
  }
}
