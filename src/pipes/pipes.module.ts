import { NgModule } from '@angular/core';
import { ActividadTitlePipe } from './actividad-title/actividad-title';
import { ActividadProgressTitlePipe } from './actividad-progress-title/actividad-progress-title';
import { DateUtcToLocalePipe } from './date-utc-to-locale/date-utc-to-locale';
@NgModule({
  declarations: [ActividadTitlePipe,
    ActividadProgressTitlePipe,
    DateUtcToLocalePipe],
  imports: [],
  exports: [ActividadTitlePipe,
    ActividadProgressTitlePipe,
    DateUtcToLocalePipe]
})
export class PipesModule {}
