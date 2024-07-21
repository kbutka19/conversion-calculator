import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CurrencyConverterComponent } from "../pages/currency-converter/currency-converter.component";
import { FormatCurrencyDirective } from "./format-currency.directive";

describe('FormatCurrencyDirective', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let inputEl: any;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CurrencyConverterComponent, FormatCurrencyDirective, HttpClientModule, MatNativeDateModule, BrowserAnimationsModule]
    });

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.loadingPage = false;
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.directive(FormatCurrencyDirective)).nativeElement;
  });

  it('should create', () => {
    const directive = new FormatCurrencyDirective(fixture.debugElement.query(By.directive(FormatCurrencyDirective)));
    expect(directive).toBeTruthy();
  });

  it('should allow numbers with up to 2 decimal places', () => {
    inputEl.value = '123.45';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123.45');
  });

  it('should not allow numbers with more than 2 decimal place', () => {
    inputEl.value = '123.456';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123.45');
  });

  it('should not allow letters', () => {
    inputEl.value = '123K';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('123');
  });

  it('should not allow some special characters', () => {
    inputEl.value = '+';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputEl.value).toBe('');
  });

});
