import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LengthConverterComponent } from './length-converter.component';
import { AbstractControl } from '@angular/forms';

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;
  let fromLength:AbstractControl | null;
  let toLength:AbstractControl | null;
  let fromAmount:AbstractControl | null;
  let toAmount:AbstractControl | null;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengthConverterComponent, BrowserAnimationsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fromLength = component.form.get('fromLength');
    toLength = component.form.get('toLength');
    fromAmount = component.form.get('fromAmount');
    toAmount = component.form.get('toAmount');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should convert meters to feet correctly when FromAmount is changed', fakeAsync(() => {
    fromLength?.setValue('Meter');
    toLength?.setValue('Foot');
    fromAmount?.setValue(1);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeCloseTo(3.28084);
  })
  );

  it('should convert meters to feet correctly when ToAmount is changed', fakeAsync(() => {
    fromLength?.setValue('Meter');
    toLength?.setValue('Foot');
    toAmount?.setValue(1);
    fixture.detectChanges();
    tick()
    expect(fromAmount?.value).toBeCloseTo(0.3048);
  })
  );

  it('should return the same value if FromLength and ToLength are the same', fakeAsync(() => {
    fromLength?.setValue('Meter');
    toLength?.setValue('Meter');
    fromAmount?.setValue(10);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBe(10);
  })
  );

  it('should not convert if FromLength is missing', fakeAsync(() => {
    toLength?.setValue('Meter');
    fromAmount?.setValue(10);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeUndefined();
  })
  );


  it('should not convert if ToLength is missing', fakeAsync(() => {
    fromLength?.setValue('Meter');
    fromAmount?.setValue(10);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeUndefined();
  })
  );

  it('should not convert if FromLength and ToLength is missing', fakeAsync(() => {
    fromAmount?.setValue(10);
    fixture.detectChanges();
    tick()
    expect(toAmount?.value).toBeUndefined();
  })
  );
});
