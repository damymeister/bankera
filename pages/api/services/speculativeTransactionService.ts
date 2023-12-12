import api_url from '@/lib/api_url';
import axios from 'axios'
import { SpeculativeTransactionCreate, SpeculativeTransactionEdit } from '@/lib/interfaces/speculative_Transaction';

const url = api_url('auth/speculativeTransaction')

export const handleCreateSpeculativeTransaction = async (data: SpeculativeTransactionCreate) => {
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
export const handleEditSpeculativeTransaction = async (data: SpeculativeTransactionEdit) => {
    try{
        const { data: res } = await axios.put(url, data, {headers: {Accept: 'application/json'}})
        return(res);
    } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
    }
};
