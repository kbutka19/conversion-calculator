import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrencyModel } from '../models/currency.model';
import { CurrencyDTO } from '../dtos/currencyDTO';
import { RateDTO, RatesObjectDTO } from '../dtos/rateDTO';
import { HistoricalRateDTO, HistoricalRatesObjectDTO } from '../dtos/historicalRateDTO';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  constructor(private httpClient: HttpClient) { }

  getListOfCurrencies(): Observable<CurrencyModel[] | void> {
    return this.httpClient
      .get<CurrencyDTO>('https://api.frankfurter.app/currencies')
      .pipe(map((res: CurrencyDTO) => this.convertToCurrencyModel(res)));
  }

  getExchangeRate(from: string, to: string): Observable<RatesObjectDTO> {
    return this.httpClient
      .get<RateDTO>(`https://api.frankfurter.app/latest?from=${from}&to=${to}`)
      .pipe(map((res: RateDTO) => res.rates));
  }

  getHistoricalValues(
    fromCurrency: string,
    toCurrency: string,
    fromDate: string,
    toDate: string
  ): Observable<HistoricalRatesObjectDTO> {
    return this.httpClient
      .get<HistoricalRateDTO>(`https://api.frankfurter.app/${fromDate}..${toDate}?from=${fromCurrency}&to=${toCurrency}`)
      .pipe(map((res: HistoricalRateDTO) => res.rates));
  }


  convertToCurrencyModel(currencies: CurrencyDTO) {
    const resultData: CurrencyModel[] = [];
    Object.keys(currencies).forEach((currency) => {
      resultData.push({ id: currency, description: currencies[currency] });
    });
    return resultData;
  }
}
