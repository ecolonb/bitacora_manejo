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
    // Conversion Ok sin aumentar o disminuir Horas
    // const dateDiff_ = 701 * 60;
    // console.log('dateDiff: Segundos transcurridos: ->', dateDiff_);
    // const horas_: any = Math.floor(dateDiff_ / 3600);
    // const minutos_: any = Math.floor((dateDiff_ - horas_ * 3600) / 60);
    // const segundos_: any = Math.round(
    //   dateDiff_ - horas_ * 3600 - minutos_ * 60
    // );
    // console.log(
    //   ' TIEMPO CONSTRUCTOR: [ ' +
    //     horas_ +
    //     ':' +
    //     minutos_ +
    //     ':' +
    //     segundos_ +
    //     ' ]'
    // );
  }
  // Incia el proceso del cronometro setInterval a 1 segundo
  public inicio() {
    console.log('Funcion inicio Load');
    if (!this.stInProgress) {
      this.stInProgress = true;
      this.date1 = new Date();
      this.control = setInterval(() => {
        this.cronometro(this);
      }, 1000);
    }
    (document.getElementById('inicio') as HTMLInputElement).disabled = true;
    (document.getElementById('parar') as HTMLInputElement).disabled = false;
    (document.getElementById('continuar') as HTMLInputElement).disabled = true;
    (document.getElementById('reinicio') as HTMLInputElement).disabled = true;
  }

  // Funcion detiene el vento debe guardarse en localStorage
  public parar() {
    console.log('Funcion parar');
    clearInterval(this.control);
    this.stInProgress = false;
    (document.getElementById('parar') as HTMLInputElement).disabled = true;
    (document.getElementById('continuar') as HTMLInputElement).disabled = false;
  }
  // Obtiene el tiempo transcurrido entre la fecha que inicio el evento y la fecha actual (Se ejecuta cada segundo)
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

  public testDatetTiime(Title: string, Date1: any, Date2: any) {
    console.log('In TestDateTime');
    const date1Test: any = new Date(Date1);
    const date2Test: Date = new Date(Date2);
    console.log(Date1 + ' <-----------> ' + Date2);
    console.log(date1Test + ' <-> ' + date2Test);
    let dateDiff = Math.abs(date1Test.valueOf() - date2Test.valueOf());

    dateDiff /= 1000;
    console.log('Segundos transcurridos: ', dateDiff);
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

  // Esta función no se utiliza, Lleba el control del cronometro en Memoria RAM (Si se suspende el dispositivo o computadora se pierde el Conteo)
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
