
export interface HistoricalRateDTO {
    amount: number;
    base: string;
    startDate: string;
    rates: HistoricalRatesObjectDTO;
    endDate: string;
}


export interface HistoricalRatesObjectDTO {
    [key: string]: {
        [key: string]: number
    }
}