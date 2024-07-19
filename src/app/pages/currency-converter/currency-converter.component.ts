import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { combineLatest, of, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CurrencyModel } from '../../models/currency.model';
import { CurrencyConverterService } from '../../services/currency-converter.service';

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
})
export class CurrencyConverterComponent implements OnInit {
  baseCurrency = '';
  form!: FormGroup;
  fetchingData?: boolean;
  currencyList: CurrencyModel[] | void = [];
  regexStr = /[\d.]/;
  exchangeRate: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private currecyConverterService: CurrencyConverterService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCurrencies();
    this.getExchangeRate();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fromCurrency: [''],
      toCurrency: [''],
      fromAmount: [undefined],
      toAmount: [undefined],
    });

    this.manageAmount();
    //This triggers valuechanges for both amounts, so combineLatest will emit even if I change only 1 amount firstly
    this.form.patchValue({ fromAmount: undefined, toAmount: undefined });
  }

  getCurrencies() {
    this.currecyConverterService
      .getListOfCurrencies()
      .pipe(
        tap((res) => {
          this.currencyList = res;
        })
      )
      .subscribe();
  }

  getExchangeRate() {
    const fromCurrency$ = this.form?.get('fromCurrency')?.valueChanges;
    const toCurrency$ = this.form?.get('toCurrency')?.valueChanges;
    if (fromCurrency$ && toCurrency$) {
      const combinedCurrencys = combineLatest({
        fromCurrency$,
        toCurrency$,
      });
      combinedCurrencys
        .pipe(
          distinctUntilChanged(),
          filter((value) => !!(value.fromCurrency$ && value.toCurrency$)),
          switchMap((value) => {
            //If currencys are the same the exchange rate is 1
            //Otherwise I call the service to get the exchange rate
            if (value.fromCurrency$ === value.toCurrency$) {
              this.exchangeRate = 1;
              return of(1);
            }
            return this.currecyConverterService
              .getExchangeRate(value.fromCurrency$, value.toCurrency$)
              .pipe(
                tap((res) => (this.exchangeRate = res[value.toCurrency$])),
                catchError((err) => {
                  this.exchangeRate = 0;
                  this.snackBar.open('Exchange Rate not found', 'Close');
                  return throwError(() => err);
                }),
                finalize(() => {
                  //This triggers the calculation of amounts if any input amounts have already been filled before the selection of currencies
                  this.form.get('fromAmount')?.value ? this.form.get('fromAmount')?.value.updateValueAndValidity()
                    : this.form.get('toAmount')?.updateValueAndValidity();
                })
              );
          })
        )
        .subscribe();
    }
  }

  manageAmount() {
    let trigger = '';
    const fromAmount$ = this.form?.get('fromAmount')?.valueChanges.pipe(tap(() => (trigger = 'from')));
    const toAmount$ = this.form?.get('toAmount')?.valueChanges.pipe(tap(() => (trigger = 'to')));
    if (fromAmount$ && toAmount$) {
      const combinedCurrencys = combineLatest({
        fromAmount$,
        toAmount$,
      });
      combinedCurrencys
        .pipe(
          distinctUntilChanged(),
          tap((value) => {
            //if from amount has changed, set the value of to amount
            if (trigger === 'from') {
              const toValue = value.fromAmount$ * this.exchangeRate;
              this.form.get('toAmount')?.setValue(toValue ? toValue : undefined,
                { emitEvent: false });
            } else {
              //if to amount has changed and there is an exhcange rate, set the value of from amount
              if (this.exchangeRate) {
                const fromValue = (value.toAmount$ / this.exchangeRate).toFixed(2);
                this.form.get('fromAmount')?.setValue(fromValue ? fromValue : undefined, {
                  emitEvent: false,
                });
              }
            }
          })
        )
        .subscribe();
    }
  }

//This serves to remove any special characters from input fields
  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    return new RegExp(this.regexStr).test(event.key);
  }
}
