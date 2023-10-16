import Layout from '@/app/layoutPattern';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import { getCurrencyPairs } from './api/services/currencyPairService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import { LiaExchangeAltSolid } from "react-icons/lia";

export default function currencyExchange(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<any[]>([ {id:null, amount: 0, currency_id: null, wallet_id : null, quoteCurrency: null, value: 0, rate:null, converted_amount:0} ])
    const [currenciesNames, setCurrenciesNames] = useState<any[]>([]);
    const [userWalletData, setUserWalletData] =  useState({wallet_id:null, firstName:"", lastName: ""})
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [exchangeRates, setExchangeRates] = useState<any>([]);

const loadData = async () =>{
    try{
        const resExchangeRates = await getCurrencyPairs();
        setExchangeRates(resExchangeRates.data);
        var walletData = await getWalletData();
        if(walletData.wallet_id){
            const userCurrencies = await getCurrencyStorage(walletData.wallet_id);

            const updatedUserCurrencies = userCurrencies.data.map((data: any) => ({
              id: data.id, 
              amount: data.amount,
              currency_id: data.currency_id,
              wallet_id: data.wallet_id,
              quoteCurrency: null,
              value: 0,
              rate: 0,
              converted_amount: 0,
            }));

            setUserOwnedCurrencies(updatedUserCurrencies);
    
            setUserWalletData((data) =>({
                ...data,
                wallet_id : walletData.wallet_id,
                firstName : walletData.first_name,
                lastName : walletData.last_name,
            }));
        }
        const currencies = await getCurrencies();
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

const handleValueToExchange = (e: any, currencyID: any) => {
  const insertedValue = e.target.value;

  const updatedUserOwnedCurrencies = userOwnedCurrencies.map((currency) => {
    if (currency.id === currencyID) {
      return {
        ...currency,
        value: parseFloat(insertedValue),
      };
    }
    return currency;
  });

  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const displaySelectOfAvailableCurrencies = (currencyID: number, currencyNumber: number, index:number) =>{
  const newCurrenciesAvailable = currenciesNames.filter((currency) => currency.id !== currencyID)
        return (
            <select className="w-1/4 text-black" onChange={(e) => handleCurrencyChange(e, currencyNumber, index)} >
              {currenciesNames.length !== 0
                ? newCurrenciesAvailable.map((currency) => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name}
                    </option>
                  ))
                : <option value="No Currencies">No Currencies</option>}
            </select>
          );
  };
 
const handleCurrencyChange = (e: any, currencyNumber: number, index:number) => {
  const selectID = e.target.value;
  const updatedUserOwnedCurrencies = userOwnedCurrencies.map((currency) => {
    if (currency.id === currencyNumber && selectID) {
      return {
        ...currency,
        quoteCurrency: parseInt(selectID),
      };
    }
    return currency
  });
  
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
  setCurrencyRate(index);
}

const setCurrencyRate = (index: number) => {
  var foundRate = 0;
  console.log(index);
  const ownedCurrencyID = userOwnedCurrencies[index].currency_id;
  const currencyToBuyID = userOwnedCurrencies[index].quoteCurrency;
  if (ownedCurrencyID && currencyToBuyID) {
    foundRate = findCurrencyRate(ownedCurrencyID, currencyToBuyID);
    const newUserOwnedCurrencies = userOwnedCurrencies.map((data, id) => {
      if (id == index) {
        setConvertedAmount(index)        
        return { ...data, rate: foundRate };
      } 
      return data;
    });
    setUserOwnedCurrencies(newUserOwnedCurrencies); 
  }
};

const findCurrencyRate = (ownedCurrencyID: number, currencyToBuyID: number) => {
  var ratetoReturn = 0;
  if(exchangeRates.length > 0){
    exchangeRates.map((rate: any) => {
      if(rate.sell_currency_id == ownedCurrencyID && rate.buy_currency_id === currencyToBuyID){
        ratetoReturn = rate.conversion_value;
      }
    })
}
  return ratetoReturn;
}

const setConvertedAmount = (index: number) =>{
  var convAmount = 0;
  console.log(userOwnedCurrencies[index].amount);
  console.log(userOwnedCurrencies[index].rate);
  if(userOwnedCurrencies[index].quoteCurrency && userOwnedCurrencies[index].rate){
    convAmount =  userOwnedCurrencies[index].amount * userOwnedCurrencies[index].rate;
  }
  console.log(convAmount);
}

const mapUserCurrencies = () => {
    if (!isLoading && userOwnedCurrencies.length > 0 && currenciesNames.length > 0 && exchangeRates.length > 0 )  {
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
                {userOwnedCurrencies.map((currency, index) => {
                  return (
                    <tr key={currency.id}>
                    <td>{findCurrencyName(currency.currency_id)}</td>
                    <td>{currency.amount}</td>
                    <td>{displaySelectOfAvailableCurrencies(currency.currency_id, currency.id, index)}</td>
                    <td className="flex items-center justify-center">
                        <input 
                            className='w-1/4 text-white bg-transparent border-white'
                            placeholder='0'
                            type="number"
                            value={userOwnedCurrencies[index].value}
                            onChange={(e) => handleValueToExchange(e, currency.id)}
                            min="0"
                        ></input>
                    </td>
                    <td>{userOwnedCurrencies[index].quoteCurrency ? userOwnedCurrencies[index].rate : "-"}</td>
                    <td>{userOwnedCurrencies[index].quoteCurrency && userOwnedCurrencies[index].rate ? userOwnedCurrencies[index].converted_amount : "-"}</td>
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
            {isLoading ? (<h1>Please wait...</h1>) : userWalletData && exchangeRates ? (
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