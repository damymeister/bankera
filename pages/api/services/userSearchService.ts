import api_url from '@/lib/api_url';
import axios from 'axios'


const url = api_url('auth/userSearch')

export const searchUsers = async (searchingPhrase: string) => {
        try {
          const urlWithQuery = `${url}?searchPhrase=${searchingPhrase}`
          const { data } = await axios.get(urlWithQuery, { headers: { Accept: 'application/json' } });
          return(data);
        } catch (error) {
          console.log('unexpected error: ', error);
          throw error;
        }
    };
