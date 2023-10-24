import api_url from '@/lib/api_url';
import axios from 'axios'


const url = api_url('auth/currency')

export const getCurrencies = async () => {
        try {
            const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
            return data;
        } catch (error) {
            console.log('unexpected error: ', error);
            throw error;
        }
    };