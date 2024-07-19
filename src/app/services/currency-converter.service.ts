import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';

export interface DTO {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private httpClient: HttpClient) {}

  getListOfCurrencies(): Observable<CurrencyModel[] | void> {
    const host = 'api.frankfurter.app'
  
    return this.httpClient
      .get<DTO>('https://api.frankfurter.app/currencies')
      .pipe(map((res: DTO) => this.convertToCurrencyModel(res)));
  }

  getExchangeRate() {
    return this.httpClient.get(
      'https://exchange-rates.abstractapi.com/v1/live/?api_key=d9e45569d9004920bea8cfb4100f4adf&base=USD&target=EUR'
    );
  }

  convertToCurrencyModel(currencies: DTO) {
    const resultData: CurrencyModel[] = [];
    Object.keys(currencies).forEach((currency) => {
      resultData.push({ id: currency, description: currencies[currency] });
    });
    return resultData;
  }
}
