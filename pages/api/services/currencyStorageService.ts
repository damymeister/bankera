import api_url from '@/lib/api_url';
import axios from 'axios'
import { IcurrencyStorage } from '@/pages/api/interfaces/currencyStorage';

const url = api_url('currencyStorage')

export const getCurrencyStorage = async (wallet_id: number) => {
    try {
        const urll = api_url('currencyStorage?id=' + wallet_id.toString())
        const res  = await axios.get(urll, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};

export const postCurrencyStorage = async (data : IcurrencyStorage ) => {
        try {
            const res  = await axios.post(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
export const updateCurrencyStorage = async (data : IcurrencyStorage) => {
        try {
            const res  = await axios.put(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
    export const deleteCurrencyStorage = async (id: number) => {
        try {
            const urll = api_url('currencyStorage?id=' + id.toString())
            const res = await axios.delete(urll, {
                headers: { Accept: 'application/json' },    
            });
            return { message: res.data.message, status: res.status };
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
    

