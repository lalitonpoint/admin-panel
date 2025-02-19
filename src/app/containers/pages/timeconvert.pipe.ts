import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

export enum UtcToLocalTimeFormat {
  FULL        = 'dd MMM yyyy hh:mm a',       
  MEDIUM      = 'd MMM yy - h:mm A',      
  SHORT       = 'DD MMM yyyy',  
  SHORT_DATE  = 'dd/MM/yyyy',
  SHORT_TIME  = 'shortTime',   
}

@Pipe({
  name: 'timeconvert'
})
export class TimeconvertPipe implements PipeTransform {

  transform(value: string , arg : any): string {
    
    if (moment(value).isValid()) {
    
      if(arg == 'FULL'){
        const format = UtcToLocalTimeFormat.FULL;
        return moment.tz(value,"Europe/Minsk").format(format);
      }
      if(arg == 'MEDIUM'){
        const format = UtcToLocalTimeFormat.MEDIUM;
        return moment.tz(value,"Europe/Minsk").format(format);
      }
      if(arg == 'SHORT'){
        const format = UtcToLocalTimeFormat.SHORT;
        return moment.tz(value,"Europe/Minsk").format(format);
      }
      if(arg == 'SHORT_DATE'){
        const format = UtcToLocalTimeFormat.SHORT_DATE;
        return moment.tz(value,"Europe/Minsk").format(format);
      }
      if(arg == 'SHORT_TIME'){
        const format = UtcToLocalTimeFormat.SHORT_TIME;
        return moment.tz(value,"Europe/Minsk").format(format);
      }
    }
    return value;
}

}
