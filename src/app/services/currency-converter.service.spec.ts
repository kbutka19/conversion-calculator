import { TestBed } from '@angular/core/testing';

import { CurrencyConverterService } from './currency-converter.service';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CurrencyConverterService', () => {
  let service: CurrencyConverterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [CurrencyConverterService
      ],
    });
    service = TestBed.inject(CurrencyConverterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should fetch currency list', () => {
    const mockData = {
      USD: 'United States Dollar',
    };

    service.getListOfCurrencies().subscribe(data => {
      expect(data).toEqual([{ id: 'USD', description: 'United States Dollar' }]);
    });

    const req = httpMock.expectOne('https://api.frankfurter.app/currencies');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });


  it('should fetch exchange rate', () => {
    const mockData = {
      amount: 1,
      base: 'EUR',
      date: '2024-07-19',
      rates: {
        USD: 1.25
      }
    };

    service.getExchangeRate('EUR', 'USD').subscribe(data => {
      expect(data).toEqual({ 'USD': 1.25 });
    });

    const req = httpMock.expectOne('https://api.frankfurter.app/latest?from=EUR&to=USD');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });


  it('should fetch historical values', () => {
    const mockData = {
      amount: 1,
      base: 'EUR',
      end_date: '2024-07-19',
      rates: {
        '2023-08-03': {
          USD: 1.52
        }
      },
      start_date: '2023-07-19'
    };

    service.getHistoricalValues('EUR', 'USD', '2023-07-19', '2024-07-19').subscribe(data => {
      expect(data).toEqual({ '2023-08-03': { USD: 1.52 } });
    });

    const req = httpMock.expectOne('https://api.frankfurter.app/2023-07-19..2024-07-19?from=EUR&to=USD');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});


