import api_url from '@/lib/api_url';
import axios from 'axios'


const url = api_url('currencyPair')

export const getCurrencyPairs = async () => {
    try {
        const res  = await axios.get(url, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};