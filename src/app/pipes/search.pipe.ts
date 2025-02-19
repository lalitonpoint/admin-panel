import { Pipe, PipeTransform } from '@angular/core';
import { LangService } from '../shared/lang.service';

@Pipe({
    name: 'searchpipe',
})
export class SearchPipe implements PipeTransform {

    constructor(private _lang: LangService) { }

    transform(value: any, search: string, searcharea: string[]): any {
        if (search !== undefined) {
            const regex = new RegExp(search, 'i');
            const data = [];
            value.forEach(element => {
                let flag = false;
                searcharea.forEach(ele => {

                    let main = ele.split('.');

                    if (main.length > 1 ? element[main[0]][main[1]].match(regex) : element[main[0]].match(regex)) {
                        flag = true;
                    }
                });
                if (flag) {
                    data.push(element);
                }
            });
            return data;
        }
        return value;
    }
}