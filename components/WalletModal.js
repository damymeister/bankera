import Layout from '@/app/layoutPattern';
import { GrClose } from "react-icons/gr";
import React, { useEffect, useState } from 'react';
import { getCurrencies } from '@/pages/api/services/currencyService';
import { postCurrencyStorage } from '@/pages/api/services/currencyStorageService';

export default function WalletModal(props) {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [data, setData] = useState({ wallet_id: 1, currency_id: 2, amount: 530 });

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await getCurrencies();
        if (data) {
          setCurrencies(data);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Error fetching wallet data.');
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (e) => {
    const selectedCurrencyId = e.target.value;
    setData((prevData) => ({
      ...prevData,
      currency_id: selectedCurrencyId,
    }));
  };

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setData((prevData) => ({
      ...prevData,
      amount: enteredAmount,
    }));
  };

  const mapCurrencies = () => {
    return (
      <select className="w-1/2" onChange={handleCurrencyChange} value={data.currency_id}>
        {currencies.length !== 0
          ? currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name}
              </option>
            ))
          : <option value="No Currencies">No Currencies</option>}
      </select>
    );
  };

  return (
    <Layout>
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
        <div className="lg:w-1/4 w-2/3 py-2 lg:h-96 min-h-1/3 h-auto bg-white rounded-xl relative border-2 text-black">
          <div className="text-black flex flex-col items-center">
            <p className="font-bold">Choose currency</p>
            {mapCurrencies()}
            <label htmlFor="name" className="font-bold">Amount</label>
            <input
              placeholder="Amount"
              id="name"
              className="mt-4 w-1/2 font-bold border-transparent border-1 focus:border-black overflow-y-auto resize-none"
              onChange={handleAmountChange}
              value={data.amount}
            />
             <button onClick={() => postCurrencyStorage(data)} className="py-2 bg-black text-white rounded-xl w-1/3">Save</button>
          </div>
          <button onClick={() => props.closeWalletModal()} className="absolute right-2 top-2">
            <GrClose className="w-6 inline mr-3 cursor-pointer" />
          </button>
        </div>
      </div>
    </Layout>
  );
}
