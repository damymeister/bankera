import api_url from '@/lib/api_url';
import axios from 'axios'
import { SpeculativeTransaction } from '@/lib/interfaces/speculative_Transaction';

const url = api_url('auth/speculativeTransaction')

export const handleCreateSpeculativeTransaction = async (data: SpeculativeTransaction) => {
    try {
        const { data: res } = await axios.post(url, data, {headers: {Accept: 'application/json'}})
        return(res);
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};
export const handleGetSpeculativeTransactions = async () => {
    try {
        const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
        return(data);
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};
