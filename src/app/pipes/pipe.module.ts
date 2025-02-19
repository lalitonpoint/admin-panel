import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundPipe } from './round.pipe'
import { SearchPipe } from './search.pipe'
import { TypeFilterPipe } from './typefilter.pipe';
import { TimeconvertPipe } from './timeconvert.pipe'
@NgModule({
  declarations: [RoundPipe,SearchPipe,TypeFilterPipe,TimeconvertPipe],
  imports: [CommonModule],
  exports: [RoundPipe,SearchPipe,TypeFilterPipe,TimeconvertPipe],
})
export class PipeModule {}
