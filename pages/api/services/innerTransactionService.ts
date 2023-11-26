import api_url from '@/lib/api_url';
import {IInnerTransaction} from '@/lib/interfaces/innerTransaction';
import axios from 'axios'

const url = api_url('auth/innerTransaction')

export const getUserInnerTransactions = async () => {
    try{
        const {data: res}  = await axios.get(url, {headers: {Accept: 'application/json'}})
        return {data: res}
    } catch (error) {
        if (axios.isAxiosError(error)) {
        if (
            error.response &&
            error.response.status >= 400 &&
            error.response.status <= 500
        ) {
            return(error.response.data.message);
        }
        }
        else console.log('unexpected error: ', error)
    }
}

export const handleCreateInnerTransaction = async (data : IInnerTransaction) => {
        try{
            const res  = await axios.post(url, data, {headers: {Accept: 'application/json'}})
            return {message: res.data.message, status: res.status};
        } catch (error) {
            if (axios.isAxiosError(error)) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                return(error.response.data.message);
            }
            }
            else console.log('unexpected error: ', error)
        }
    }


