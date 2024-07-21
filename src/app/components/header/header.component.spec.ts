import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CurrencyConverterComponent } from '../../pages/currency-converter/currency-converter.component';
import { LengthConverterComponent } from '../../pages/length-converter/length-converter.component';
import { HomeComponent } from '../home/home.component';
import { HeaderComponent } from './header.component';

const Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'currency-converter',
    component: CurrencyConverterComponent,
  },
  {
    path: 'length-converter',
    component: LengthConverterComponent,
  },
];

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, BrowserAnimationsModule, RouterModule.forRoot(Routes)
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement: HTMLElement = fixture.nativeElement.querySelector('.header-title');
    expect(titleElement.textContent?.trim()).toBe('Convertion Calculator');
  });

  it('should have the hamburger menu button', () => {
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('.hamburger-button');
    expect(buttonElement).toBeTruthy();
  });

  it('should open the sidenav when the hamburger button is clicked, and close it when clicked again', () => {
    const buttonElement = fixture.nativeElement.querySelector('.hamburger-button');
    buttonElement.click();
    fixture.detectChanges();
    expect(component.sidenav?.opened).toBeTrue();

    buttonElement.click();
    fixture.detectChanges();
    expect(component.sidenav?.opened).toBeFalse();
  });

  it('should close the sidenav when an item in the menu is clicked', () => {
    const buttonElement = fixture.nativeElement.querySelector('.hamburger-button');
    buttonElement.click();
    fixture.detectChanges();
    component.sidenav?.toggle();
    expect(component.sidenav?.opened).toBeFalse();
  });
});
