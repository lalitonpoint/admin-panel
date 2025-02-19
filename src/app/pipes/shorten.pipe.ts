import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'shortpipe' })
export class ShortPipe implements PipeTransform {
  transform(text: string, limit: number = 5) {
    if (text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  }
}
