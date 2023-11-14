import api_url from '@/lib/api_url';
import axios from 'axios'


const url = api_url('auth/currencyPairs')

export const getCurrenciesPairs = async () => {
        try {
            const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
            return data;
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };