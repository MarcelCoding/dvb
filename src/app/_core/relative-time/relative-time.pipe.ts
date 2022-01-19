import {Inject, LOCALE_ID, Optional, Pipe, PipeTransform, ɵstringify} from '@angular/core';
import {DATE_PIPE_DEFAULT_TIMEZONE} from "@angular/common";

/**
 * https://github.com/tuhinkarmakar/ng-relative-time/blob/master/projects/relative-time/src/lib/pipes/relative-time.pipe.ts
 */
@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) {
  }

  transform(date: Date): string {
    const now = new Date()

    /* If an invalid string was passed, the epoch will be `NaN` */
    if (isNaN(date.getTime())) {
      /* Using the same error message style as Angular */
      throw Error(`InvalidPipeArgument: '${date}' for pipe '${ɵstringify(RelativeTimePipe)}'`)
    }

    const diffInMilliSecs = date.getTime() - now.getTime()
    const diffInSecs = Math.trunc(diffInMilliSecs / 1000)

    /* Take the absolute difference.
    Doesn't matter whether `date` is in the past or future. We only want the difference. */
    const absDiffInSecs = Math.abs(diffInSecs)

    /* Parentheses are needed around `case` blocks to redeclare the `formatter` variable */
    switch (true) {
      case absDiffInSecs < 60: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        return formatter.format(diffInSecs, "second");
      }

      case absDiffInSecs >= 60 && absDiffInSecs < 3600: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const minutes = Math.trunc(diffInSecs / 60);

        return formatter.format(minutes, "minute");
      }

      case absDiffInSecs > 3600 && absDiffInSecs < 86400: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const hours = Math.trunc(diffInSecs / 3600);

        return formatter.format(hours, "hour");
      }

      case absDiffInSecs >= 86400 && absDiffInSecs < 604800: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const days = Math.trunc(diffInSecs / 86400);

        return formatter.format(days, "day");
      }

      case absDiffInSecs >= 604800 && absDiffInSecs < 2592000: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const weeks = Math.trunc(diffInSecs / 604800);

        return formatter.format(weeks, "week");
      }

      case absDiffInSecs >= 2592000 && absDiffInSecs < 31536000: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const months = Math.trunc(diffInSecs / 2592000);

        return formatter.format(months, "month");
      }

      case absDiffInSecs >= 31536000: {
        const formatter = new Intl.RelativeTimeFormat(this.locale, {numeric: "auto"});
        const years = Math.trunc(diffInSecs / 31536000);

        return formatter.format(years, "year");
      }

      default:
        return "";
    }
  }
}
