export interface ICreateCurrencyStorage{
    currency_id : number;
    wallet_id : number,
    amount: number;
  }
  export interface IcurrencyStorage {
    id: number,
    currency_id : number;
    wallet_id : number,
    amount: number;
  }
  export interface IEditCurrencyStorage {
    id: number,
    amount:number
  }
  export interface CurrencyMapItem {
    id: number;
    name: string;
  }