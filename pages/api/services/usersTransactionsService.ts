import api_url from '@/lib/api_url';
import {IUserTransaction} from '@/lib/interfaces/userTransaction';
import axios from 'axios'

const url = api_url('auth/usersTransactions')

export const handleCreateUsersTransactions = async (data : IUserTransaction) => {
    try{
        console.log(data)
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
