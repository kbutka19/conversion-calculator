import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (await import('./components/home/home.component')).HomeComponent,
  },
  {
    path: 'currency-converter',
    loadComponent: async () =>
      (
        await import(
          './pages/currency-converter/currency-converter.component'
        )
      ).CurrencyConverterComponent,
  },
  {
    path: 'length-converter',
    loadComponent: async () =>
      (
        await import(
          './pages/length-converter/length-converter.component'
        )
      ).LengthConverterComponent,
  },
];
