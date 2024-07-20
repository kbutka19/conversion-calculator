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
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    const startPosition = this.el.nativeElement.selectionStart;

    const next: string = [current.slice(0, startPosition), event.key == 'Decimal' ? '.' : event.key, current.slice(startPosition)].join('');
    console.log('slice' + current.slice(startPosition))
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event'])
  public onInput(event:any) {
    let val: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    if (event.data == '.' && val.split('.').length > 2) {
      console.log("This restricts the additional decimal.")
      this.el.nativeElement.value = val.slice(0, position - 1);
    }

    if (val.length == 9 && !val.includes('.')) {
      this.el.nativeElement.value = val + '.';
    }
  }
}