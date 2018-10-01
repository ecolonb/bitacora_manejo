import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfiguracionProvider } from './../app-configuracion/app-configuracion';

// ******** PROVIDERS
import { BitacoraProvider } from '../bitacora/bitacora';
import { UtilidadesProvider } from '../utilidades/utilidades';
import { ConductorProvider } from './../conductor/conductor';

// ******** MODELS
import { DiasLocalItemTimeModel } from '../../models/dias-local-item-time.model';
import { DiasLocalTimeModel } from '../../models/dias-local-time.model';
import { InfinityScrollRequestModel } from '../../models/infinity-scroll-request.model';

/*
  -> Las actividades se muestran desde page bitácora

  TODO:
    => convertir a Date() fecha inicio - fin + minutos offset = dia actual
      ->fechaLocal >=  2018-09-17 00:00:00 AND fechaLocal <= 2018-09-17 23:59:59
        -> SI: agregar al objDia
                -fechaHoraInicio  =  ObjBitacora.fechaHoraInicio
                -fechaHoraFin     =  ObjBitacora.fechaHoraFin
          ->  SI NO:
              if fechaLocal >= 2018-09-17 00:00:00
                if fechaLocal >= 2018-09-17 23:59:59
                    -fechaHoraInicio  =  2018-09-17 00:00:00
                    -fechaHoraFin     =  2018-09-17 23:59:59
*/
@Injectable()
export class LocalTimeActivitysProvider {
  // public URL_: string =
  // public 'http://dev1.copiloto.com.mx/lab/rest/api/infinity_scroll';
  public ComplementEndPoint = 'rest/api/infinity_scroll';
  public AllDaysUTC: DiasLocalTimeModel = {
    TimeZone: 'GTM 05000',
    MinutosOffSet: 300,
    diasLocal: []
  };

  constructor(
    public http: HttpClient,
    private bitacoraProvider: BitacoraProvider,
    private conductorProvider: ConductorProvider,
    private utilidadesProvider: UtilidadesProvider,
    private appConfiguracionProvider: AppConfiguracionProvider
  ) {}
  public activitysSeparator(): Promise<any> {
    const promiseActivitysSeparator = new Promise((resolve, reject) => {
      try {
        if (
          this.bitacoraProvider.BitacoraData &&
          this.bitacoraProvider.BitacoraData !== null &&
          this.bitacoraProvider.BitacoraData !== undefined
        ) {
          // for (const itBitacora of this.bitacoraProvider.BitacoraData) {
          // }
          resolve();
        } else {
          reject();
        }
      } catch (e) {
        reject(e);
      }
    });
    return promiseActivitysSeparator;
  }

  public getDataFromServer(InfinityScrol: boolean): Promise<any> {
    const getDataFromServer = new Promise((resolve, reject) => {
      let IdConductor: number;
      let IdUsuarioParent: number;
      let FechaInicio: string;
      let FechaFin: string;
      let Token: string;
      const MinutosOfSet: number = Number(
        this.utilidadesProvider.getTimeZone('minutosTimeOfSet')
      );
      if (InfinityScrol === true) {
        FechaInicio = '';
        FechaFin = '';
      } else {
        // Si no es infinityScroll toma la fechaActual
        // Validar cuando la fecha esta atrasada -> ArrayRespuesta
        const now = new Date();
        let month: any = now.getMonth() + 1;
        let day: any = now.getDate();
        let year: any = now.getFullYear();
        if (Number(month) < 10) {
          month = '0' + month;
        }
        if (Number(day) < 10) {
          day = '0' + day;
        }
        FechaFin = year + '-' + month + '-' + day;
        now.setMinutes(now.getMinutes() - 1440);
        month = now.getMonth() + 1;
        day = now.getDate();
        year = now.getFullYear();
        if (Number(month) < 10) {
          month = '0' + month;
        }
        if (Number(day) < 10) {
          day = '0' + day;
        }
        FechaInicio = year + '-' + month + '-' + day;
      }

      IdConductor = this.conductorProvider.IdConductor();
      IdUsuarioParent = this.conductorProvider.IdUsuarioParent();
      Token = this.appConfiguracionProvider.getToken();

      this.requestDataActivitysAndServiceFS(
        IdConductor,
        IdUsuarioParent,
        FechaInicio,
        FechaFin,
        MinutosOfSet,
        InfinityScrol,
        Token
      )
        .then((ResponseData) => {
          // this.AllDaysUTC.diasLocal
          const DiaItem: DiasLocalItemTimeModel = {
            Terminado: false,
            FechaLocal: new Date(),
            ServicesByDaysLocalTime: ResponseData.services,
            ActivitysByDaysLocalTime: ResponseData.activitys
          };
          if (
            this.AllDaysUTC.diasLocal &&
            this.AllDaysUTC.diasLocal !== null &&
            this.AllDaysUTC.diasLocal !== undefined &&
            this.AllDaysUTC.diasLocal.length > 0
          ) {
            this.AllDaysUTC.diasLocal.push(DiaItem);
          } else {
            this.AllDaysUTC = {
              TimeZone: 'GTM 05000',
              MinutosOffSet: 300,
              diasLocal: []
            };
            this.AllDaysUTC.diasLocal.push(DiaItem);
          }

          resolve(true);
        })
        .catch((errorRequest) => {
          reject(errorRequest);
        });
    });
    return getDataFromServer;
  }

  // Peticion al server para obtener Servicio Y Actividades
  private requestDataActivitysAndServiceFS(
    IdConductor: number,
    IdUsuarioParent: number,
    FechaInicio: string,
    FechaFin: string,
    MinutosOfSet: number,
    IfinityScroll: boolean,
    Token: string
  ): Promise<any> {
    const promiseGetDataASFS = new Promise((resolve, reject) => {
      const HEADERS = {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      };
      const Dias: number = 2;
      const dataSendform: InfinityScrollRequestModel = {
        Dias,
        FechaInicio,
        FechaFin,
        IdConductor,
        IdUsuarioParent,
        MinutosOfSet,
        IfinityScroll,
        Token
      };
      const UrlEndPointCompletly: string =
        this.appConfiguracionProvider.getServerEndPoint() +
        this.ComplementEndPoint;

      this.http
        .post(UrlEndPointCompletly, dataSendform, HEADERS)
        .toPromise()
        .then((RESULT_DATA) => {
          resolve(RESULT_DATA);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promiseGetDataASFS;
  }
}
