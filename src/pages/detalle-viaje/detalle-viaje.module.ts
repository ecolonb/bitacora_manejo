import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleViajePage } from './detalle-viaje';

@NgModule({
  declarations: [
    DetalleViajePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleViajePage),
  ],
})
export class DetalleViajePageModule {}
