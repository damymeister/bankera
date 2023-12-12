import api_url from '@/lib/api_url';
import { IForexCurrencyStorage  } from '@/lib/interfaces/forexCurrencyStorage';
import axios from 'axios'
import { spec } from 'node:test/reporters';

const url = api_url('auth/forexCurrencyStorage')

export const getForexCurrencyStorage = async () => {
    try {
        const res  = await axios.get(url, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};
export const getForexCurrencyStorageById = async (forex_wallet_id : number, forex_currency_id: number) => {
    try {
        const specifiedUrl = `${url}?forex_currency_id=${forex_currency_id}&forex_wallet_id=${forex_wallet_id}`
        const res  = await axios.get(specifiedUrl, {headers: {Accept: 'application/json'}});
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};
export const updateForexCurrencyStorageForexOperations = async (data : IForexCurrencyStorage) => {
        try {
            const res  = await axios.put(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };