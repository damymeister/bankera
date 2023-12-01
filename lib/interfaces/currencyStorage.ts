export  interface ICurrencyStorage {
    id: number,
    currency_id : number,
    wallet_id : number,
    amount: number,
}

export interface ICreateCurrencyStorage{
    currency_id : number,
    wallet_id : number,
    amount: number,
}

export interface IEditCurrencyStorage {
    id: number,
    amount: number,
}

export interface ClickedCurrency {
    clickedCurrencyAmount: number;
    clickedCurrencyName: string;
    clickedCurrencyStorageID: number;
    clickedCurrencyCurrencyID: number;
  }