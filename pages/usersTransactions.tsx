import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import { getCurrencyPair } from './api/services/currencyPairService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import Layout from "@/app/layoutPattern";
import {FaExclamation}  from "react-icons/fa";
import SnackBar from '@/components/snackbar'
import { ICurrency } from './api/interfaces/currency';
import { IWallet } from './api/interfaces/wallet';
import '@/components/css/home.css';
import { IcurrencyStorage, CurrencyMapItem } from './api/interfaces/currencyStorage';

export default function usersTransactions(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<IcurrencyStorage[]>([])
    const [currenciesNames, setCurrenciesNames] = useState<ICurrency[]>([]);
    const [userWalletData, setUserWalletData] =  useState<IWallet>({wallet_id:0, first_name:"", last_name: ""})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const [amountToChange, setAmountToChange] = useState<number>(0.0);
    const [currencyMap, setCurrencyMap] = useState(new Map<number, CurrencyMapItem>());

    const snackbarProps = {
      status: snackStatus,
      icon: <FaExclamation />,
      description: snackMess
  };

  const setCurrencyMapData = (userCurrencies: IcurrencyStorage[], currenciesNames: ICurrency[]) =>{
    for (let i = 0; i < userCurrencies.length; i++) {
        for (let j = 0; j < currenciesNames.length; j++) {
          if (userCurrencies[i].currency_id === currenciesNames[j].id && userCurrencies[i].id != undefined) {
            currencyMap.set(userCurrencies[i].id, {
              id: currenciesNames[j].id,
              name: currenciesNames[j].name
            });
          }
        }
      }
  }

  useEffect(() => {
    console.log("Currency Map in useEffect:", currencyMap);
  }, [currencyMap]);

  const loadData = async () =>{
    try{
        setIsLoading(true);
        const currencies = await getCurrencies();
        setCurrenciesNames(currencies);
        
        const walletData = await getWalletData();
        setUserWalletData(walletData);
        const userCurrencies = await getCurrencyStorage(walletData.wallet_id);
        setUserOwnedCurrencies(userCurrencies.data);
        setCurrencyMapData(userCurrencies.data, currencies);
      
    }catch(error){
        setSnackbarProps({snackStatus: "danger", message: "Nie udało się pobrać danych portfela.", showSnackbar: true});
    }finally{
        setIsLoading(false);
    }
}

  useEffect(()=>{
    loadData();
  },[])
  
  
  useEffect(()=>{
    setTimeout(()=>{
      setShowSnackbar(false);
     }, 4000)
  },[showSnackbar])


  const setSnackbarProps = ({ snackStatus, message, showSnackbar }: { snackStatus: string, message: string, showSnackbar?: boolean }) => {
    if (snackStatus && message) {
      setsnackStatus(snackStatus);
      setsnackMess(message);

      if (showSnackbar !== undefined) {
        setShowSnackbar(showSnackbar);
      }
  };
}

const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = parseFloat(e.target.value);
    setAmountToChange(enteredAmount);
  };

const displayUserCurrencies = () =>{
    if(!isLoading && userOwnedCurrencies.length == 0){
        return "You have empty wallet!"
    }
    const currencyMapArray = Array.from(currencyMap);
    return(
        <select className="w-1/2 text-black">
            {currencyMapArray.map(([key, value])=>(
            <option key = {key} value={value.id}>
                {value.name}
            </option>
            ))}
        </select>
    )
}

    return(
    <Layout>
         {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
        <div className="w-full flex items-center justify-center">
        {isLoading ? <h1>Is loading...</h1> : 
        <div className='w-3/4 my-4 mz-2 flex items-center justify-center flex-col'>
            <h1 className='text-2xl textUnderline'>Hello {userWalletData.first_name} {userWalletData.last_name}</h1>
            <h4 className='text-wrap textUnderline mx-2'>Do you want to send a transfer to another user in our application? It has never been easier than now. With the Bankera app, all you need to do is search for the other user by personal information or email address, choose the amount and the currency you want to send. It's that simple!</h4>
            <div className='flex flex-col gap-4 items-center'>
                <div className='flex flex-row gap-8 mt-4'>
                    <label htmlFor="currencyToSend" className="font-bold mr-1 flex items-center justify-center">Currency to send:
                        {displayUserCurrencies()}
                    </label>
                    <label htmlFor="amount" className="font-bold mr-1 flex items-center justify-center mr-2">Amount:
                        <input
                        placeholder="0"
                        id="amount"
                        type="number"
                        min="0"
                        className="w-24 font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none"
                        onChange={handleAmountChange}
                        value={amountToChange}
                        />
                    </label>
                </div>
                <button className="py-4 button2 text-white rounded-xl hover:cursor-pointer text-xs w-1/3">Send a transfer</button>
            </div>
        </div>
        }
        </div>
    </Layout>
    )
} 
