import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  {
    path: '',
    //hiqe kete se eshte i vogel
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
  
];
