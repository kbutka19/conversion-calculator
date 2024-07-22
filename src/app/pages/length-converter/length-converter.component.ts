import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { combineLatest, distinctUntilChanged, filter, tap } from 'rxjs';
import { LENGTH_UNITS } from '../../constants/length-units';

@Component({
  selector: 'app-length-converter',
  standalone: true,
  imports: [
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIcon,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './length-converter.component.html',
  styleUrl: './length-converter.component.scss'
})
export class LengthConverterComponent implements OnInit {
  form!: FormGroup;
  lengthList: string[] = [];
  resultMsg1!: string;
  resultMsg2!: string;
  lengthUnits: { [key: string]: { id: number, pluralName: string } } = LENGTH_UNITS;
  fromLength!: string;
  toLength!: string;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.lengthList = Object.keys(this.lengthUnits);
    this.manageLengths();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fromLength: [''],
      toLength: [''],
      fromAmount: [0],
      toAmount: [0]
    });

    this.calculateAmounts();
    //This triggers valuechanges for both amounts, so combineLatest will emit even if I change only 1 amount firstly
    this.form.patchValue({ fromAmount: undefined, toAmount: undefined });
  }

  manageLengths() {
    const fromLength$ = this.form?.get('fromLength')?.valueChanges;
    const toLength$ = this.form?.get('toLength')?.valueChanges;
    if (fromLength$ && toLength$) {
      const combinedLengths = combineLatest({
        fromLength$,
        toLength$,
      });
      combinedLengths
        .pipe(
          distinctUntilChanged(),
          filter(value => !!(value.fromLength$ && value.toLength$)),
          tap(value => {
            this.fromLength = value.fromLength$,
              this.toLength = value.toLength$;
            //This triggers the calculation of amounts if any input amounts have already been filled
            //From amount has priority when both amounts are filled
            const from = this.form.get('fromAmount')?.value;
            const to = this.form.get('toAmount')?.value;
            if (from) {
              this.form.get('fromAmount')?.reset()
              this.form.get('fromAmount')?.setValue(from)
            } else if (to) {
              this.form.get('toAmount')?.reset()
              this.form.get('toAmount')?.setValue(to)
            }
          })
        ).subscribe();
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
              const toValue = this.convertLengths(value.fromAmount$, this.fromLength, this.toLength);
              this.form.get('toAmount')?.setValue(toValue ? toValue : undefined,
                { emitEvent: false });
            } else {
              //if to amount has changed, set the value of from amount
              const fromValue = this.convertLengths(value.toAmount$, this.toLength, this.fromLength);
              this.form.get('fromAmount')?.setValue(fromValue ? fromValue : undefined, {
                emitEvent: false,
              });
            }
            //This is used to display the message in the screen
            const formData = this.form.getRawValue();
            if (formData.fromLength && formData.toLength && formData.fromAmount && formData.toAmount) {
              const from = formData.fromAmount === 1 ? formData.fromLength : this.lengthUnits[formData.fromLength].pluralName;
              const to = formData.toAmount === 1 ? formData.toLength : this.lengthUnits[formData.toLength].pluralName;
              this.resultMsg1 = formData.fromAmount + ' ' + from;
              this.resultMsg2 = formData.toAmount + ' ' + to;
            }
          })
        )
        .subscribe();
    }
  }

  swapLengths() {
    const from = this.form.get('fromLength')?.value;
    const to = this.form.get('toLength')?.value;
    this.form.get('fromLength')?.reset();
    this.form.get('toLength')?.reset();
    this.form.get('fromLength')?.setValue(to);
    this.form.get('toLength')?.setValue(from);
    this.fromLength = to;
    this.toLength = from;
  }

  reset() {
    this.form.reset();
    this.fromLength = '';
    this.toLength = '';
    this.resultMsg1 = ''
    this.resultMsg2 = ''
  }

  convertLengths(value: number, from: string, to: string): number {
    if (from && to && this.lengthUnits[from] && this.lengthUnits[to]) {
      const baseValue = value * this.lengthUnits[from].id;
      return parseFloat((baseValue / this.lengthUnits[to].id).toFixed(6));
    }
    return 0;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
    return new RegExp(/[\d.]/).test(event.key);
  }
}
