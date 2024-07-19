import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';
import { CurrencyDTO } from '../dtos/currencyDTO';
import { RateDTO, RatesObjectDTO } from '../dtos/rateDTO';


@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private httpClient: HttpClient) {}

  getListOfCurrencies(): Observable<CurrencyModel[] | void> {
    const host = 'api.frankfurter.app';

    return this.httpClient
      .get<CurrencyDTO>('https://api.frankfurter.app/currencies')
      .pipe(map((res: CurrencyDTO) => this.convertToCurrencyModel(res)));
  }

  getExchangeRate(from: string, to: string):Observable<RatesObjectDTO> {
    return this.httpClient
      .get<RateDTO>(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
      .pipe(map((res:RateDTO) => res.rates));
  }

  convertToCurrencyModel(currencies: CurrencyDTO) {
    const resultData: CurrencyModel[] = [];
    Object.keys(currencies).forEach((currency) => {
      resultData.push({ id: currency, description: currencies[currency] });
    });
    return resultData;
  }
}
