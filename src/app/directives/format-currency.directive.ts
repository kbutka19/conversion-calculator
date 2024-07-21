import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[appFormatCurrency]',
  standalone: true
})
export class FormatCurrencyDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Del', 'Delete'];
  constructor(private el: ElementRef) {
  }
  @HostListener('input', ['$event'])
  onKeyDown(event: any) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const startPosition = this.el.nativeElement.selectionStart;
    const next: string = [current.slice(0, startPosition), event.key == 'Decimal' ? '.' : event.key, current.slice(startPosition)].join('');
    if (next && !String(next).match(this.regex)) {
      this.el.nativeElement.value = next.slice(0, -1)
    }
  }
}