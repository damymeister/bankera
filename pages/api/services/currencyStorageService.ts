import api_url from '@/lib/api_url';
import { ICreateCurrencyStorage, IEditCurrencyStorage} from '@/lib/interfaces/currencyStorage';
import axios from 'axios'

const url = api_url('auth/currencyStorage')

export const getCurrencyStorage = async () => {
    try {
        const res  = await axios.get(url, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};

export const postCurrencyStorage = async (data : ICreateCurrencyStorage ) => {
        try {
            const res  = await axios.post(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };
export const updateCurrencyStorage = async (data : IEditCurrencyStorage) => {
        try {
            const res  = await axios.put(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };




