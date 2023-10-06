import api_url from '@/lib/api_url';
import axios from 'axios'


const url = api_url('wallet')

export const getWalletData = async () => {
        try {
          const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
          return(data);
        } catch (error) {
          console.log('unexpected error: ', error);
          throw error;
        }
    };

export const handleCreateWallet = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            const { data: res } = await axios.post(url, data, {headers: {Accept: 'application/json'}})
            console.log(res.message)
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

export const handleEditWallet = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try{
            const { data: res } = await axios.put(url, data, {headers: {Accept: 'application/json'}})
            console.log(res.message)
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




export const handleDeleteWallet = async (e: React.SyntheticEvent, id) => {
        e.preventDefault();
        try {
          const { data: res } = await axios.delete(url, id, { headers: { Accept: 'application/json' } });

        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
              // Tutaj możesz obsłużyć błąd odpowiedzi z serwera.
            }
          } else {
            console.log('unexpected error: ', error);
          }
        }
      };