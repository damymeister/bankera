import Layout from '@/app/layoutPattern';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import { getCurrencyPairs } from './api/services/currencyPairService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import { LiaExchangeAltSolid } from "react-icons/lia";

export default function currencyExchange(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<any[]>([ {id:0, amount: 0, currency_id: 0, wallet_id : 0, quoteCurrency: 0, value: 0, rate: 0.0, converted_amount: 0} ])
    const [currenciesNames, setCurrenciesNames] = useState<any[]>([]);
    const [userWalletData, setUserWalletData] =  useState({wallet_id:null, firstName:"", lastName: ""})
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [exchangeRates, setExchangeRates] = useState<any>([]);
    const [quoteCurrencyState, setQuoteCurrencyState] = useState<number | null>(null);

const loadData = async () =>{
    try{
        const resExchangeRates = await getCurrencyPairs();
        setExchangeRates(resExchangeRates.data);
        var walletData = await getWalletData();
        if(walletData.wallet_id){
            const userCurrencies = await getCurrencyStorage(walletData.wallet_id);

            const newupdatedUserCurrencies = userCurrencies.data.map((data: any) => ({
              id: data.id, 
              amount: data.amount,
              currency_id: data.currency_id,
              wallet_id: data.wallet_id,
              quoteCurrency: 1,
              value: 0,
              rate: 0,
              converted_amount: 0,
            }));

            setUserOwnedCurrencies(newupdatedUserCurrencies);
    
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
      setConvertedAmount();
      return {
        ...currency,
        value: parseFloat(insertedValue),
      };
    }
    return currency;
  });
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const displaySelectOfAvailableCurrencies = (currencyID: number, currencyNumber: number) =>{
  const newCurrenciesAvailable = currenciesNames.filter((currency) => currency.id !== currencyID)
        return (
            <select className="w-1/4 text-black" onChange={(e) => handleCurrencyChange(e, currencyNumber)} >
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
 
const handleCurrencyChange = (e: any, currencyNumber: number) => {
  const selectID = e.target.value;
  console.log(currencyNumber);
  const updatedUserOwnedCurrencies = userOwnedCurrencies.map((currency) => {
    if (currency.id == currencyNumber) {
      return {
        ...currency,
        quoteCurrency: parseInt(selectID),
      };
    }
    
    return currency
  });
  setQuoteCurrencyState(parseInt(selectID));
  console.log("HANDLECURRENCYCHANGE");
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const findCurrencyRate = (ownedCurrencyID: number, currencyToBuyID: number) => {
  var ratetoReturn = 0;
    exchangeRates.map((rate: any) => {
      if(rate.sell_currency_id == ownedCurrencyID && rate.buy_currency_id == currencyToBuyID){
        ratetoReturn = rate.conversion_value;
      }
    })
  return ratetoReturn;
}

const setCurrencyRate = async () => {
  const updatedUserOwnedCurrencies = await Promise.all(userOwnedCurrencies.map(async (currency) => {
    const rate = await findCurrencyRate(currency.currency_id, currency.quoteCurrency);
    return { ...currency, rate };
  }));
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
};


const setConvertedAmount = async () =>{
  const updatedUserOwnedCurrencies = await Promise.all(userOwnedCurrencies.map((currency) => ({
        ...currency,
        converted_amount: (currency.value * currency.rate).toFixed(2),
  })));
  console.log(updatedUserOwnedCurrencies);
  console.log("SETCCONVERTEDAMOUNT");
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

useEffect(() => {
  console.log("userOwnedCurrencies updated:", userOwnedCurrencies);
}, [userOwnedCurrencies]);

useEffect(() => {
  if (quoteCurrencyState !== null) {
    setCurrencyRate();
    setConvertedAmount();
  }
}, [quoteCurrencyState]);

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
                    <td>{displaySelectOfAvailableCurrencies(currency.currency_id, currency.id)}</td>
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
                    <td>{userOwnedCurrencies[index].rate ? userOwnedCurrencies[index].rate : "-"}</td>
                    <td>{userOwnedCurrencies[index].converted_amount ? <span> {userOwnedCurrencies[index].converted_amount} {findCurrencyName(userOwnedCurrencies[index].quoteCurrency)} </span>: "-"}</td>
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