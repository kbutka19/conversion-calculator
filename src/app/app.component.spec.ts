import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { CurrencyConverterComponent } from './pages/currency-converter/currency-converter.component';
import { LengthConverterComponent } from './pages/length-converter/length-converter.component';
import { RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './components/header/header.component';

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

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule,RouterModule.forRoot(Routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should contain the header component`, () => {
    const childDebugElement = fixture.nativeElement.querySelector('app-header');
    expect(childDebugElement).toBeTruthy();
  });
});
