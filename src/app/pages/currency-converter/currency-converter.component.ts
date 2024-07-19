import { CommonModule, formatCurrency } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CurrencyConverterService } from '../../services/currency-converter.service';
import { combineLatestWith, filter, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CurrencyModel } from '../../models/currency.model';
import { combineLatest, Observable } from 'rxjs';

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

  constructor(
    private formBuilder: FormBuilder,
    private currecyConverter: CurrencyConverterService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCurrencies();
    this.getExchangeRate();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fromCurrency: [''],
      toCurrency: [''],
      inputData: [''],
      outputData: [''],
    });
  }

  getCurrencies() {
    this.currecyConverter
      .getListOfCurrencies()
      .pipe(
        tap((res) => {
          this.currencyList = res;
        })
      )
      .subscribe();
  }

  getExchangeRate() {
    const input1Changes$ = this.form?.get('fromCurrency')?.valueChanges;
    const input2Changes$ = this.form?.get('toCurrency')?.valueChanges;
    if (input1Changes$ && input2Changes$) {
      input1Changes$.pipe(
        combineLatestWith(input2Changes$)
      );
    }
  }

  changeAmount(e: string) {}
  getConversionRate(e?: string) {}

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    return new RegExp(this.regexStr).test(event.key);
  }
}
