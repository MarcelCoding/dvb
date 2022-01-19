import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) private locale: string,
  ) {
  }

  transform(value: Date): string {
    const formatter = new Intl.DateTimeFormat(this.locale, { timeStyle: "short"})
    return formatter.format(value);
  }
}
