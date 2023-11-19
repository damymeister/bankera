import { useEffect, useState } from 'react';
import axios from 'axios';
import '@/components/css/currency.css';
import '@/components/css/home.css';
import { ICurrencyHistory } from '@/lib/interfaces/currencyHistory';
import { getCurrencyNameById, inZeroRange, significantDigits } from '@/lib/currency';
import { FaExchangeAlt } from 'react-icons/fa';
import api_url from '@/lib/api_url';

export default function Currency() {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyHistory, setCurrencyHistory] = useState<ICurrencyHistory[]>([]);
  const allSelector: ICurrency = { id: -1, name: 'Wszystkie' };

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        let url = api_url('auth/currencyHistory') + '?timestamp=' + '2h' + '&includeDiff=true&invert=true&sell_currency_id=' + '118';
        const { data } = await axios.get(url, { headers: { Accept: 'application/json' } });
        // console.log(data);
        setCurrencyHistory(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const handleGetCurrencies = async () => {
      const { data } = await axios.get(api_url('auth/currency'), { headers: { Accept: 'application/json' } });
      setCurrencies([allSelector, ...data] as ICurrency[]);
    };
    handleGetCurrencies();
  }, []);

  const formatDiff = (value: number | undefined) => {
    if (value === undefined) return <span></span>;
    if (inZeroRange(value)) return <span className="text-gray-400 text-xs self-start">0.00</span>;
    if (value > 0) return <span className="text-green-400 text-xs self-start">{'+' + value.toFixed(significantDigits(value))}</span>;
    return <span className="text-red-500 text-xs self-start">{value.toFixed(significantDigits(value))}</span>;
  };

  return (

    <div className=''>
      <div className='text-center flex flex-row'>
      <div className='pr-2'>Ostatnia aktualizacja: </div>  
      <div className=' text-[#BB86FC]'>{currencyHistory.length > 0 ? new Date(currencyHistory[0].history[0].date).toLocaleString() : '-'}</div>
      </div>
      
    <div className='flex flex-row py-4 my-2'>
      {currencyHistory.length > 0 ? (
        <>
        
        {currencyHistory.slice(0, 3).map((currency: any) => (
          
          <div key={currency.buy_currency_id.toString()} className=''>
            <div className="currency p-8">
              <div className="flex flex-row items-center justify-center gap-x-2">
                <span>{getCurrencyNameById(currencies, currency.sell_currency_id)}</span>
                <FaExchangeAlt />
                <span>{getCurrencyNameById(currencies, currency.buy_currency_id)}</span>
              </div>
              <div className="">
                <div className="flex flex-row items-center gap-x-1">
                  Kupno: 
                  <span>{currency.history[0].invertedConversion && currency.history[0].invertedConversion.toFixed(significantDigits(currency.history[0].invertedConversion))}</span>
                  {formatDiff(currency.invertedDiffTotal)}
                </div>
              </div>
              <div className="">
                <div className="flex flex-row items-center gap-x-1">
                  Sprzedaż: 
                  <span>{currency.history[0].conversion_value.toFixed(significantDigits(currency.history[0].conversion_value))}</span>
                  {formatDiff(currency.diffTotal)}
                </div>
              </div>
            </div>
          </div>
        ))}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    </div> 
  );
}