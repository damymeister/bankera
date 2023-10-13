import Layout from '@/app/layoutPattern';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import { LiaExchangeAltSolid } from "react-icons/lia";

export default function currencyExchange(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<any[]>([])
    const [currenciesNames, setCurrenciesNames] = useState<any[]>([]);
    const [userWalletData, setUserWalletData] =  useState({wallet_id:null, firstName:"", lastName: ""})
    const [newCurrencyExchange, setNewCurrencyExchange] = useState<number>();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
const loadData = async () =>{
    try{
        var walletData = await getWalletData();
        if(walletData.wallet_id){
            const userCurrencies = await getCurrencyStorage(walletData.wallet_id);
            setUserOwnedCurrencies(userCurrencies.data);
            if(userCurrencies){
                console.log(userOwnedCurrencies);
            }
            setUserWalletData((data) =>({
                ...data,
                wallet_id : walletData.wallet_id,
                firstName : walletData.first_name,
                lastName : walletData.last_name,
            }));
        }
        const currencies = await getCurrencies();
        console.log(currencies);
        setCurrenciesNames(currencies);
    }catch(error){
        console.error('Error while fetching data', error);
        setError('Error while fetching wallet data.');
    }finally{
        setIsLoading(false);
    }
}

useEffect(()=>{
    loadData();
},[])

const findCurrencyName = (currencyID : number) =>{
    var currencyname = null;
    currenciesNames.forEach(currency => {
        if(currencyID == currency.id){
            currencyname = currency.name;
        }
    });
    return currencyname;
}

const handleValueToExchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const insertedValue = e.target.value;
    const numericValue = parseFloat(insertedValue);
    setValueToExchange(numericValue);
}

const displaySelectOfAvailableCurrencies = (currencyID: number) =>{
        return (
            <select className="w-1/4" onChange={handleCurrencyChange} value={data.currency_id}>
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
}

const mapUserCurrencies = () => {
    if (!isLoading && userOwnedCurrencies.length > 0 && currenciesNames.length > 0) {
      return (
        <div>
            <table className='w-full py-4 m-4 borderLightY text-white'>
              <thead>
                <tr>
                  <th>Base Currency</th>
                  <th>Wallet Amount</th>
                  <th>Quote Currency</th>
                  <th>Value</th>
                  <th>Rate</th>
                  <th>Converted Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userOwnedCurrencies.map((currency) => {
                  return (
                    <tr key={currency.id}>
                    <td>{findCurrencyName(currency.currency_id)}</td>
                    <td>{currency.amount}</td>
                    <td>{displaySelectOfAvailableCurrencies(currency.currency_id)}</td>
                    <td className="flex items-center justify-center">
                        <input 
                            className='w-1/4 text-white bg-transparent border-white'
                            placeholder='0'
                            value={valueToExchange}
                            onChange={handleValueToExchange}
                            min="0"
                        ></input>
                    </td>
                    <td>Rate</td>
                    <td>ConvertedAmount</td>
                    <td className='flex items-center justify-center'><LiaExchangeAltSolid className = "text-white cursor-pointer text-2xl"/></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      );
    }
  };

    return(
        <Layout>
            {isLoading ? (<h1>Please wait...</h1>) : userWalletData ? (
                <div className='m-8'>
                   <h1 className='text-2xl'>Hello {userWalletData.firstName} {userWalletData.lastName}</h1>
                    <p>You can exchange currencies in your wallet below.</p>
                    {mapUserCurrencies()}
                </div>
                ) 
                : null}
        </Layout>
    )
}