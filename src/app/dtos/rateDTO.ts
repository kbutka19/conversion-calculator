export interface RateDTO {
  amount: number;
  base: string;
  date: string;
  rates: RatesObjectDTO;
}

export interface RatesObjectDTO{
    [key: string]: number
}
