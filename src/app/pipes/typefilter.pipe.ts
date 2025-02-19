import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typefilter'
})
export class TypeFilterPipe implements PipeTransform {
  transform(types: any, search_value: string): any {
    if(!search_value) {
      return types;
    }
    return types.filter((types) => {
      return types.typename.toLowerCase().match(search_value.toLowerCase());
    });
  }

}