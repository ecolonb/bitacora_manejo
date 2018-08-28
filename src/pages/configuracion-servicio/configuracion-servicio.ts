import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  App,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  Slides,
  ViewController
} from 'ionic-angular';
import { UnidadRequestModel } from '../../models/unidad-response.model';
import { BitacoraProvider } from '../../providers/bitacora/bitacora';
import { LoginProvider } from '../../providers/login/login';
import { UnidadProvider } from '../../providers/unidad/unidad';
import { ServicioModel } from './../../models/servicio.model';
import { UnidadModel } from './../../models/unidad.model';
import { ConductorProvider } from './../../providers/conductor/conductor';
import { LoginPage, MenuPage } from './../index-paginas';

/**
 * En esta página se configura el servicio los datos que solicita la norma de la SCT.
 */

@IonicPage()
@Component({
  selector: 'page-configuracion-servicio',
  templateUrl: 'configuracion-servicio.html'
})
export class ConfiguracionServicioPage {
  @ViewChild(Slides)
  public slides: Slides;
  public tipoDeServicio: string = 'default';
  public modalidadDeServicio: string = 'default';
  public NombreConductor: string = 'Copiloto';
  public origenServicio: string;
  public destinoServicio: string;
  public descripcionRutaASeguir: string;
  public nombreUnidad: string = '';
  public confirmacionConfSer: boolean = false;
  public objUnidadSeleccionada: UnidadModel;

  public searchQuery: string = '';
  public items: string[];
  public objUnidades: UnidadModel[];
  public itemsS2: any;
  public searchTerm: string = '';
  public itemsSr: any;

  public tipoServicioDescLong: string = '';
  public modalidadServicioDescLong: string = '';

  // ******** variables Globales *********
  private menuPage: any = MenuPage;
  private loginPage: any = LoginPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private bitacoraProvider: BitacoraProvider,
    private app: App,
    private viewController: ViewController,
    private loginProvider: LoginProvider,
    public conductorProvider: ConductorProvider,
    private unidadProvider: UnidadProvider,
    private loadingCtrl: LoadingController
  ) {
    /**
     */
    // Aqui realizar peticiones para ontener la lista de unidades
    // if (this.unidadProvider.cargarFromStorage) {
    //   this.unidadProvider.getUnidadesFromStorage().then(() => {});
    // } else {
    //   this.unidadProvider.getUnidadesPost();
    // }
  }
  public setFilteredItems() {
    console.log('Realizando busqueda-->' + this.searchTerm);
    if (this.searchTerm !== '') {
      this.itemsSr = this.filterItems(this.searchTerm);
      console.log('this.itemsSr' + JSON.stringify(this.itemsSr));
      // Validar cuantos elelementos se encuentran: console.log('this.itemsSr', this.itemsSr.length);
    } else {
      delete this.itemsSr;
    }
  }
  public ngAfterViewInit() {
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
    this.slides.paginationType = 'progress';
  }
  public ionViewDidLoad() {
    // this.setFilteredItems();
    const loading = this.loadingCtrl.create({
      content: 'Cargandando lista de unidades, porfavor espere...'
    });
    loading.present();
    if (this.unidadProvider.cargarFromStorage) {
      this.unidadProvider
        .getUnidadesFromStorage()
        .then(() => {
          // Una vez que se cargan las unidades del Storage verficar si existe el objUnidades si no realizar peticion post
          if (
            !this.unidadProvider.arrObjUnidades ||
            this.unidadProvider.arrObjUnidades === null
          ) {
            console.log('No existe objeto se vuelve a realzar peticion!');
            this.unidadProvider
              .getUnidadesPost()
              .then((RESULT_DATA: UnidadRequestModel) => {
                console.log(
                  'Result from promesa in configruacion servicio: ' +
                    JSON.stringify(RESULT_DATA)
                );
                this.unidadProvider.mappingResult(RESULT_DATA);
                console.log('Loading from request post');
                loading.dismiss();
              });
          } else {
            console.log(
              'Unidades cargadas from storage: ',
              this.unidadProvider.arrObjUnidades
            );
            loading.dismiss();
          }
        })
        .catch((error) => {
          loading.dismiss();
        });
    } else {
      this.unidadProvider
        .getUnidadesPost()
        .then((RESULT_DATA: UnidadRequestModel) => {
          console.log(
            'Result from promesa in configruacion servicio: ' +
              JSON.stringify(RESULT_DATA)
          );
          this.unidadProvider.mappingResult(RESULT_DATA);
          loading.dismiss();
        });
    }
  }
  public nextSlideConfirmacion() {
    let error: boolean = false;
    // Despues de entrar en esta funcion debe guardar los datos que se capturan
    let liErrores: string = '';

    if (
      this.objUnidadSeleccionada == null ||
      this.objUnidadSeleccionada === undefined
    ) {
      error = true;
      liErrores += '<li style="float:left;">Debes elegir una unidad</li>';
    }
    if (this.tipoDeServicio === 'default') {
      error = true;
      liErrores +=
        '<li style="float:left;">Debes elegir un tipo de servicio</li>';
    }
    if (error) {
      // En caso de error en los datos capturados se dispara la alerta
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: '<ul>' + liErrores + '</ul>',
        buttons: [
          {
            text: 'Ok',
            role: 'ok'
          }
        ]
      });
      alert.present();
    } else {
      // Esto se ejecuta si no hay errores al validar
      this.confirmacionConfSer = true;

      if (this.tipoDeServicio === 'deCarga') {
        this.tipoServicioDescLong = 'De carga';
      } else if (this.tipoDeServicio === 'deCargaGeneral') {
        this.tipoServicioDescLong = 'De carga general';
      } else if (this.tipoDeServicio === 'deCargaEspecializada') {
        this.tipoServicioDescLong = 'De carga especializada';
      } else if (this.tipoDeServicio === 'turismo') {
        this.tipoServicioDescLong = 'Turismo';
      } else if (this.tipoDeServicio === 'pasajeros') {
        this.tipoServicioDescLong = 'Pasajeros';
      } else if (this.tipoDeServicio === 'privado') {
        this.tipoServicioDescLong = 'Privado';
      }

      if (this.modalidadDeServicio === 'default') {
        this.modalidadServicioDescLong = 'Sin modalidad';
      } else if (this.modalidadDeServicio === 'deLujo') {
        this.modalidadServicioDescLong = 'De lujo';
      } else if (this.modalidadDeServicio === 'ejecutivo') {
        this.modalidadServicioDescLong = 'Ejecutivo';
      } else if (this.modalidadDeServicio === 'primera') {
        this.modalidadServicioDescLong = 'Primera';
      } else if (this.modalidadDeServicio === 'economico') {
        this.modalidadServicioDescLong = 'Economico';
      } else if (this.modalidadDeServicio === 'mixto') {
        this.modalidadServicioDescLong = 'Mixto';
      } else if (this.modalidadDeServicio === 'turistico') {
        this.modalidadServicioDescLong = 'Turístico';
      } else if (this.modalidadDeServicio === 'turisticoDeLujo') {
        this.modalidadServicioDescLong = 'Turístico de lujo';
      } else if (this.modalidadDeServicio === 'deCargaGeneral') {
        this.modalidadServicioDescLong = 'De carga general';
      } else if (this.modalidadDeServicio === 'deCargaEspecializada') {
        this.modalidadServicioDescLong = 'De carga especializada';
      } else if (this.modalidadDeServicio === 'excursion') {
        this.modalidadServicioDescLong = 'Excursión';
      } else if (this.modalidadDeServicio === 'choferGuia') {
        this.modalidadServicioDescLong = 'Chofer - Guía';
      }

      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
    }
  }

  public showOptionsToLogInApp() {
    const alertOpion = this.alertCtrl.create({
      title: 'Elige una opción',
      inputs: [
        {
          type: 'radio',
          label: 'Iniciar servicio',
          value: 'IniciarServicio',
          checked: true
        },
        { type: 'radio', label: 'Ver bitácora', value: 'VerBitacora' },
        { type: 'radio', label: 'Salir', value: 'Salir' }
      ],
      buttons: [
        {
          text: 'Cancelar'
        },
        {
          text: 'Ok',
          handler: (DataOk: string) => {
            if (DataOk === 'VerBitacora') {
              // Cambiar variable Status appConfiguracion verbitacora
              this.app.getRootNavs()[0].setRoot(this.menuPage);
            }
            if (DataOk === 'IniciarServicio') {
              // Cambiar variable Status appConfiguracion IniciarServicio
              this.app.getRootNavs()[0].setRoot(this.menuPage);
            }
            if (DataOk === 'Salir') {
              // Cambiar variable Status appConfiguracion verbitacora
              // Cerrar Sesion

              this.loginProvider.cerrarSesion().then(() => {
                // this.navCtrl.setRoot(LoginPage);
                // use that this.App.getRootNavs()[0].setRoot(LoginPage); for this.App.getRootNav().setRoot(LoginPage)
                this.app.getRootNavs()[0].setRoot(this.loginPage);
              });
            }
          }
        }
      ]
    });
    alertOpion.present();
  }

  // Se inicia el servicio : se guarda información en localStorage
  public iniciarServicio() {
    // Cuando se inicia el servicio se arma el objeto configuración servicio en ese mismo objeto se establece la unidad seleccionada.
    // Falta obtener los datos del Permisionario Nombre/Razon social y Dirección
    const objConfServicio: ServicioModel = {
      IdServicio: 121,
      IdCondcutor: 1368,
      Unidad: this.objUnidadSeleccionada,
      DireccionOrigen: this.origenServicio,
      DireccionDestino: this.destinoServicio,
      Ruta: this.descripcionRutaASeguir,
      TipoServicio: this.tipoServicioDescLong,
      ModalidadServicio: this.modalidadServicioDescLong,
      Permisionario: 'Saul Teja Gonzalez',
      PermisionarioDomicilio: 'El Yaqui 2050'
    };

    this.bitacoraProvider.iniciarServicio(objConfServicio);
    this.app.getRootNavs()[0].setRoot(this.menuPage);
  }

  public filterItems(searchTerm) {
    return this.unidadProvider.arrObjUnidades.filter((item: UnidadModel) => {
      return (
        item.nuid
          .toString()
          .toLowerCase()
          .indexOf(searchTerm.toLowerCase()) > -1
      );
    });
  }
  public setUnidad(ObjSearch: UnidadModel) {
    this.objUnidadSeleccionada = ObjSearch;
    this.searchTerm =
      this.objUnidadSeleccionada.nuid.toString() +
      ' - ' +
      this.objUnidadSeleccionada.placas +
      ' - ' +
      this.objUnidadSeleccionada.modelo;
    this.nombreUnidad = this.searchTerm;
    delete this.itemsSr;
  }
  public goBackConfiguration() {
    this.confirmacionConfSer = false;
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }
  public slectTipoServicio(ionElement: any) {
    // Asignando valor seleccionado
    this.tipoDeServicio = String(ionElement);
    // Cerrando vista actual selectTipoDeServicio
    this.closeCurrentView();
  }

  public slectModalidadServicio(ionElement: any) {
    // Asignando valor seleccionado
    this.modalidadDeServicio = String(ionElement);
    // Cerrando vista actual selectTipoDeServicio
    this.closeCurrentView();
  }
  // Cerrar vista actual
  public closeCurrentView() {
    const root = this.viewController.instance.navCtrl._app._appRoot;
    const view = root._overlayPortal._views[0];
    view.dismiss();
  }
  public onCancel(event) {
    try {
      delete this.objUnidadSeleccionada;
    } catch (error) {}
  }
}
