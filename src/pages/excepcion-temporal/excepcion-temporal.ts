import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-excepcion-temporal',
  templateUrl: 'excepcion-temporal.html'
})
export class ExcepcionTemporalPage {
  // PAra mantener el ambito de las variables
  public that = this;
  public strCentesimas: string = ':00';
  public strSegundos: string = ':00';
  public strMinutos: string = ':00';
  public strHoras: string = '00';
  public date1: Date = null;
  public date2: Date;
  private centesimas: number = 0;
  private segundos: number = 0;
  private minutos: number = 0;
  private horas: number = 0;
  private control: any;
  private stInProgress: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // code test
    const dateTest1 = this.convertUTCDateToLocalDate(
      new Date('2018-08-06T03:14:56')
    );
    console.log('2018-08-06 03:14:56 <-> ', dateTest1);
    this.testDatetTiime(
      'Servicio : ',
      '2018-08-06T03:14:56',
      '2018-08-05T02:58:44'
    );
    this.testDatetTiime(
      'Manejo : ',

      '2018-08-06T03:14:53',
      '2018-08-05T22:08:20'
    );

    const dateDiff_ = 701 * 60;
    console.log('dateDiff: Segundos transcurridos: ->', dateDiff_);
    const horas_: any = Math.floor(dateDiff_ / 3600);
    const minutos_: any = Math.floor((dateDiff_ - horas_ * 3600) / 60);
    const segundos_: any = Math.round(
      dateDiff_ - horas_ * 3600 - minutos_ * 60
    );
    console.log(
      ' TIEMPO CONSTRUCTOR: [ ' +
        horas_ +
        ':' +
        minutos_ +
        ':' +
        segundos_ +
        ' ]'
    );
  }

  public inicio() {
    console.log('Funcion inicio Load');
    setInterval(() => {
      if (!this.stInProgress) {
        this.stInProgress = true;
        this.date1 = new Date();
      }
      this.cronometro(this);
    }, 200);
    (document.getElementById('inicio') as HTMLInputElement).disabled = true;
    (document.getElementById('parar') as HTMLInputElement).disabled = false;
    (document.getElementById('continuar') as HTMLInputElement).disabled = true;
    (document.getElementById('reinicio') as HTMLInputElement).disabled = true;
  }
  public cronometro(that) {
    that.date2 = new Date();
    console.log(that.date1 + ' <-> ' + that.date2);
    let dateDiff = that.date2.valueOf() - that.date1.valueOf();

    dateDiff /= 1000;
    console.log('dateDiff: Segundos transcurridos: ->', dateDiff);
    let horas: any = Math.floor(dateDiff / 3600);
    let minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    let segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);

    if (horas < 10) {
      horas = '0' + horas;
    }
    that.strHoras = String(horas);

    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    that.strMinutos = ':' + String(minutos);

    if (segundos < 10) {
      segundos = '0' + segundos;
    }
    that.strSegundos = ':' + String(segundos);

    console.log('Time: ', horas + ':' + minutos + ':' + segundos);
  }
  public parar() {
    console.log('Parar');
    // Deshabilitar boton
    (document.getElementById('parar') as HTMLInputElement).disabled = true;
    // Habilitar boton
    (document.getElementById('continuar') as HTMLInputElement).disabled = false;
  }
  public testDatetTiime(Title: string, Date1: any, Date2: any) {
    console.log('In TestDateTime');
    const date1Test: any = new Date(Date1);
    const date2Test: Date = new Date(Date2);
    console.log(date1Test + ' <-> ' + date2Test);
    let dateDiff = date1Test.valueOf() - date2Test.valueOf();

    dateDiff /= 1000;

    const horas: any = Math.floor(dateDiff / 3600);
    const minutos: any = Math.floor((dateDiff - horas * 3600) / 60);
    const segundos: any = Math.round(dateDiff - horas * 3600 - minutos * 60);
    console.log(
      Title +
        ' TIEMPO transcurridos: [ ' +
        horas +
        ':' +
        minutos +
        ':' +
        segundos +
        ' ]'
    );
  }
  public convertUTCDateToLocalDate(date) {
    console.log('In convertUTCDateToLocalDate', date);
    const newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - 6);
    console.log(' newDate', newDate);
    return newDate;
  }
  public cronometroManual(that) {
    that.segundos++;
    console.log('In fn cronometro', that.segundos, that.minutos, that.horas);
    if (that.segundos === 60) {
      that.minutos++;
    }
    if (that.segundos === 60 && that.minutos === 60) {
      that.segundos = 0;
      that.minutos = 0;
      that.horas++;
    } else {
      if (that.segundos === 60) {
        that.segundos = 0;
      }
    }
    if (that.segundos < 10) {
      that.strSegundos = ':0' + that.segundos;
    } else {
      that.strSegundos = ':' + that.segundos;
    }
    if (that.minutos < 10) {
      that.strMinutos = ':0' + that.minutos;
    } else {
      that.strMinutos = ':' + that.minutos;
    }
    if (that.horas < 10) {
      that.strHoras = '0' + String(that.horas);
    } else {
      that.strHoras = String(that.horas);
    }
  }
}
