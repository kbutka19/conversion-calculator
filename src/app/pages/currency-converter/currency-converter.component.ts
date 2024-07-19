import { CommonModule, formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

interface FormModel {
  fromCurrency: FormControl<string | null>;
  // name: FormGroup<{
  //   firstName: FormControl<string | null>;
  //   lastName: FormControl<string | null>;
  // }>;
}
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
  form: FormGroup = new FormGroup({
    fromCurrency: new FormControl(''),
  });
  fetchingData?: boolean;
  currencies = [];

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fromCurrency: [''],
    });
  }
  checkFormat(e: KeyboardEvent) {
    console.log(e);
  }

  changeAmount(e: string) {}
  getConversionRate(e?: string) {}
}
