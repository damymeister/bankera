export default interface IUser {
    id?: number,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number?: string,
    wallet_id?: number,
    forex_wallet_id?: number,
    account_created_on: Date,
    role_id?: number,
}

export interface ILoginUser {
    email: string,
    password: string,
}

export interface IRegisteringUser {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    phone_number: string,
}

export interface IUserSearch {
    id: number,
    first_name:string,
    last_name: string,
    email:string,
    wallet_id: number,
}