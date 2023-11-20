import api_url from '@/lib/api_url';
import axios from 'axios'


export const getCurrencyPair = async (ownedCurrencyID: number, currencyToBuyID: number) => {
    try {
        const urlWithQuery = api_url(`currencyPair?sell_currency_id=${currencyToBuyID}&buy_currency_id=${ownedCurrencyID}`)
        const res  = await axios.get(urlWithQuery, {headers: {Accept: 'application/json'}})
        return {data: res.data};
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};