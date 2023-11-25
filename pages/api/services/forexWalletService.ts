import api_url from '@/lib/api_url';
import axios from 'axios'

const url = api_url('auth/forexWallet')

export const getForexWalletData = async () => {
        try {
          const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
          return(data);
        } catch (error) {
          console.log('unexpected error: ', error);
          throw error;
        }
    };
export const checkExistenceOfForexWallet = async () => {
    try {
        const { data } = await axios.get(api_url('auth/doesForexWalletExist'), { headers: { Accept: 'application/json' } });
        return(data);
      } catch (error) {
        console.log('unexpected error: ', error);
        throw error;
      }
  };

export const handleCreateForexWallet = async () => {
        try{
            const { data: res } = await axios.post(url, {headers: {Accept: 'application/json'}})
            console.log(res);
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

export const handleDeleteForexWallet = async (id: number) => {
        try {
          const combined_url = api_url('auth/forexWallet?id=' + id.toString())
          const res = await axios.delete(combined_url, {
              headers: { Accept: 'application/json' },    
          });
          return { message: res.data.message, status: res.status };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status >= 400 && error.response.status <= 500) {
            }
          } else {
            console.log('unexpected error: ', error);
          }
        }
      };