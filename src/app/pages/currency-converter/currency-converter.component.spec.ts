import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { CurrencyModel } from '../../models/currency.model';
import { CurrencyConverterService } from '../../services/currency-converter.service';
import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
  let component: CurrencyConverterComponent;
  let fixture: ComponentFixture<CurrencyConverterComponent>;
  let fromCurrency: AbstractControl | null;
  let toCurrency: AbstractControl | null;
  let fromAmount: AbstractControl | null;
  let toAmount: AbstractControl | null;
  let fromDate: AbstractControl | null;
  let toDate: AbstractControl | null;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyConverterComponent, BrowserAnimationsModule, HttpClientModule, MatNativeDateModule],
      providers: [CurrencyConverterService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    fromCurrency = component.form.get('fromCurrency');
    toCurrency = component.form.get('toCurrency');
    fromAmount = component.form.get('fromAmount');
    toAmount = component.form.get('toAmount');
    fromDate = component.form.get('fromDate');
    toDate = component.form.get('toDate');
  });

  beforeEach(() => {
    let mockResponse = [
      { id: 'EUR', description: 'EURO' },
      { id: 'USD', description: 'US Dollars' },
      { id: 'AUD', description: 'Australian Dollar' },
      { id: 'CAD', description: 'Canadian Dollar' },
      { id: 'GBP', description: 'British Pound' },
    ]
    spyOn(component.currecyConverterService, 'getListOfCurrencies').and.returnValue(of(mockResponse));
    component.getCurrencies();
  })


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert from one currency to another when FromAmount is changed', fakeAsync(() => {
    const from = (component.currencyList as CurrencyModel[])[0].id;
    const to = (component.currencyList as CurrencyModel[])[1].id;
    spyOn(component.currecyConverterService, 'getExchangeRate').and.returnValue(of(
      {
        [to]: 409.55
      }
    ));
    tick()
    fromCurrency?.setValue(from);
    toCurrency?.setValue(to);
    fromAmount?.setValue(1);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toEqual(jasmine.any(Number));
  })
  );


  it('should not convert when FromCurrency is missing', fakeAsync(() => {
    const to = (component.currencyList as CurrencyModel[])[3].id;
    spyOn(component.currecyConverterService, 'getExchangeRate').and.returnValue(of(
      {
        [to]: 1.55
      }
    ));
    tick()
    toCurrency?.setValue(to);
    fromAmount?.setValue(1);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeUndefined();
  })
  );

  it('should not convert when ToCurrency is missing', fakeAsync(() => {
    const from = (component.currencyList as CurrencyModel[])[1].id;
    spyOn(component.currecyConverterService, 'getExchangeRate').and.returnValue(of(
      {
        'random': 1.56
      }
    ));
    tick()
    fromCurrency?.setValue(from);
    fromAmount?.setValue(1);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeUndefined();
  })
  );

  it('should enable historical values button when dates are valid', () => {
    fromDate?.enable();
    fromDate?.setValue(new Date());
    toDate?.enable();
    toDate?.setValue(new Date());
    fixture.detectChanges()

    const disabledButton = fixture.debugElement.query(By.css('.history-button')).nativeElement.disabled;
    expect(disabledButton).toBeFalsy();
  });

  it('should disable historical values button when ToDate is not filled', () => {
    fromDate?.enable();
    fromDate?.setValue(new Date());
    fixture.detectChanges();

    const disabledButton = fixture.debugElement.query(By.css('.history-button')).nativeElement.disabled;

    expect(disabledButton).toBeTruthy();
  });


  it('should display chart on history button clicked', fakeAsync(() => {
    component.getConversionHistory();
    spyOn(component.currecyConverterService, 'getHistoricalValues').and.returnValue(of(
      {
        'EUR': {
          'USD': 1.2
        }
      },
      {
        'EUR': {
          'USD': 1.25
        }
      }
    ));
    tick()
    fixture.detectChanges();
    tick()
    expect(component.showChart).toBeTrue();
  })
  );
});
