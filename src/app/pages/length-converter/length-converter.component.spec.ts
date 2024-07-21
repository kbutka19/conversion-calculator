import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthConverterComponent } from './length-converter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;
  let fromLength: string;
  let toLength: string;
  let fromAmount: number;
  let toAmount: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengthConverterComponent, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const form = component.form.getRawValue();
    fromLength = form.fromLength;
    toLength = form.toLength;
    fromAmount = form.fromAmount;
    toAmount = form.toAmount;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert meters to feet correctly', () => {
    fromAmount = 1;
    fromLength = 'Meter';
    toLength = 'Feet';
    fixture.detectChanges();

    expect(fromLength).toBeCloseTo(3.28084);
  });

  it('should convert feet to meters correctly', () => {
    // component.value = 3.28084;
    // component.fromUnit = 'feet';
    // component.toUnit = 'meters';
    // component.convert();

    // expect(component.result).toBeCloseTo(1);
  });

  it('should return the same value if fromUnit and toUnit are the same', () => {
    //   component.value = 10;
    //   component.fromUnit = 'meters';
    //   component.toUnit = 'meters';
    //   component.convert();

    //   expect(component.result).toBe(10);
   });
  });
