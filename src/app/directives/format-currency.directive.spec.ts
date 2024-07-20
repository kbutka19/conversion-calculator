import { ElementRef } from "@angular/core";
import { FormatCurrencyDirective } from "./format-currency.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe('FormatCurrencyDirective', () => {

  let component: FormatCurrencyDirective;
  let fixture: ComponentFixture<FormatCurrencyDirective>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormatCurrencyDirective ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatCurrencyDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // it('should create an instance', () => {
  //   let el: ElementRef;
  //   const directive = new FormatCurrencyDirective(el);
  //   expect(directive).toBeTruthy();
  // });
});
