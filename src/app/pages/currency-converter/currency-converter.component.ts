import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { combineLatest, of, throwError } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap,
} from 'rxjs/operators';
import { FormatCurrencyDirective } from '../../directives/format-currency.directive';
import { HistoricalRatesObjectDTO } from '../../dtos/historicalRateDTO';
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
    FormatCurrencyDirective,
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    CanvasJSAngularChartsModule
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss',
})
export class CurrencyConverterComponent implements OnInit {
  form!: FormGroup;
  loadingPage?: boolean;
  currencyList: CurrencyModel[] | void = [];
  resultMsg: boolean = false
  exchangeRate: number = 0;
  chartOptions: any;
  showChart: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
     public currecyConverterService: CurrencyConverterService,
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
      fromAmount: [0],
      toAmount: [0],
      fromDate: [{ value: undefined, disabled: true }],
      toDate: [{ value: undefined, disabled: true }]
    });

    this.calculateAmounts();
    //This triggers valuechanges for both amounts, so combineLatest will emit even if I change only 1 amount firstly
    this.form.patchValue({ fromAmount: undefined, toAmount: undefined });
  }

  getCurrencies() {
    this.loadingPage = true;
    this.currecyConverterService
      .getListOfCurrencies()
      .pipe(
        tap((res) => this.currencyList = res),
        finalize(() => this.loadingPage = false)
      ).subscribe();
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
            this.form.get('fromDate')?.enable();
            this.form.get('toDate')?.enable();
            //If currencys are the same the exchange rate is 1
            //Otherwise I call the service to get the exchange rate
            if (value.fromCurrency$ === value.toCurrency$) {
              this.exchangeRate = 1;
              this.manageAmounts();
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
                  this.manageAmounts()
                })
              );
          })
        ).subscribe();
    }
  }

  //This triggers the calculation of amounts if any input amounts have already been filled
  //From amount has priority when both amounts are filled
  manageAmounts() {
    const from = this.form.get('fromAmount')?.value;
    const to = this.form.get('toAmount')?.value;
    if (from) {
      this.form.get('fromAmount')?.reset()
      this.form.get('fromAmount')?.setValue(from)
    } else if (to) {
      this.form.get('toAmount')?.reset()
      this.form.get('toAmount')?.setValue(to)
    }
  }

  calculateAmounts() {
    let trigger = '';
    const fromAmount$ = this.form?.get('fromAmount')?.valueChanges.pipe(tap(() => (trigger = 'from')));
    const toAmount$ = this.form?.get('toAmount')?.valueChanges.pipe(tap(() => (trigger = 'to')));
    if (fromAmount$ && toAmount$) {
      const combinedAmounts = combineLatest({
        fromAmount$,
        toAmount$,
      });
      combinedAmounts
        .pipe(
          distinctUntilChanged(),
          tap((value) => {
            //if from amount has changed, set the value of to amount
            if (trigger === 'from') {
              const toValue = parseFloat((value.fromAmount$ * this.exchangeRate).toFixed(2));
              this.form.get('toAmount')?.setValue(toValue ? toValue : undefined,
                { emitEvent: false });
            } else {
              //if to amount has changed and there is an exhcange rate, set the value of from amount
              if (this.exchangeRate) {
                const fromValue = parseFloat((value.toAmount$ / this.exchangeRate).toFixed(2));
                this.form.get('fromAmount')?.setValue(fromValue ? fromValue : undefined, {
                  emitEvent: false,
                });
              }
            }
            //This is used to display the message in the screen
            const formData = this.form.getRawValue();
            formData.fromCurrency && formData.toCurrency && formData.fromAmount && formData.toAmount ?
              this.resultMsg = true : this.resultMsg = false;
          })
        )
        .subscribe();
    }
  }

  swapCurrencies() {
    const from = this.form.get('fromCurrency')?.value;
    const to = this.form.get('toCurrency')?.value;
    this.form.get('fromCurrency')?.reset();
    this.form.get('toCurrency')?.reset();
    this.form.get('fromCurrency')?.setValue(to);
    this.form.get('toCurrency')?.setValue(from);
  }

  reset() {
    this.form.reset();
    this.form.get('fromDate')?.disable();
    this.form.get('toDate')?.disable();
    this.exchangeRate = 0;
    this.showChart = false;
  }

  getConversionHistory() {
    const fromDate = this.convertDate(this.form.get('fromDate')?.value);
    const toDate = this.convertDate(this.form.get('toDate')?.value);
    const fromCurrency = this.form.get('fromCurrency')?.value;
    const toCurrency = this.form.get('toCurrency')?.value;
    this.currecyConverterService.getHistoricalValues(fromCurrency, toCurrency, fromDate, toDate).
      pipe(tap(res => {
        this.createChart(fromCurrency, toCurrency, res);
        this.showChart = true;
      }),
        catchError((err) => {
          this.showChart = false;
          this.snackBar.open(`Historical values between ${fromCurrency} and ${toCurrency} not found`, 'Close');
          return throwError(() => err);
        }),).subscribe()
  }

  get disableHistoryBtn() {
    return !(this.form.get('fromDate')?.value && this.form.get('fromDate')?.valid &&
      this.form.get('toDate')?.value && this.form.get('toDate')?.valid)
  }

  convertDate(date: Date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()))
    const result = JSON.stringify(utcDate)
    return result.slice(1, 11)
  }

  createChart(fromCurrency: string, toCurrency: string, rates: HistoricalRatesObjectDTO) {
    const dataPoints: any[] = [];
    Object.keys(rates).forEach(key => {
      dataPoints.push({
        x: new Date(key),
        y: rates[key][toCurrency]
      })
    })

    this.chartOptions = {
      theme: "light2",
      animationEnabled: true,
      zoomEnabled: true,
      title: {
        text: `Historical rates between ${fromCurrency} and ${toCurrency}`
      },
      data: [{
        type: "line",
        xValueFormatString: "DD-MM-YYYY",
        yValueFormatString: "$#,###.##",
        dataPoints: dataPoints
      }]
    }
  }

}
