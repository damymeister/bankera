import api_url from '@/lib/api_url';
import { IForexCurrencyStorage, IEditForexCurrencyStorage } from '@/lib/interfaces/forexCurrencyStorage';
import axios from 'axios'

const url = api_url('auth/forexCurrencyStorage')

export const getForexCurrencyStorage = async (forex_wallet_id: number) => {
    try {
        const combined_url = api_url('auth/forexCurrencyStorage?id=' + forex_wallet_id.toString())
        const res  = await axios.get(combined_url, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};

export const postForexCurrencyStorage = async (data : IForexCurrencyStorage ) => {
        try {
            const res  = await axios.post(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
export const updateForexCurrencyStorage = async (data : IEditForexCurrencyStorage) => {
        try {
            const res  = await axios.put(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
export const deleteForexCurrencyStorage = async (id: number) => {
    try {
        const combined_url = api_url('auth/forexCurrencyStorage?id=' + id.toString())
        const res = await axios.delete(combined_url, {
            headers: { Accept: 'application/json' },    
        });
        return { message: res.data.message, status: res.status };
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};


//