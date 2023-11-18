import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import { getCurrencyPair } from './api/services/currencyPairService';
import { searchUsers } from './api/services/userSearchService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import Layout from "@/app/layoutPattern";
import {FaExclamation}  from "react-icons/fa";
import SnackBar from '@/components/snackbar'
import { ICurrency } from './api/interfaces/currency';
import { IWallet } from './api/interfaces/wallet';
import '@/components/css/home.css';
import { IcurrencyStorage, CurrencyMapItem } from './api/interfaces/currencyStorage';
import { ICurrencyNameBalance } from './api/interfaces/usersTransactions';
import { IUser, IUserSearch } from './api/interfaces/user';
import { BsReverseLayoutSidebarInsetReverse } from 'react-icons/bs';

export default function usersTransactions(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<IcurrencyStorage[]>([])
    const [currenciesNames, setCurrenciesNames] = useState<ICurrency[]>([]);
    const [userWalletData, setUserWalletData] =  useState<IWallet>({wallet_id:0, first_name:"", last_name: ""})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const [amountToChange, setAmountToChange] = useState<number>(0.0);
    const [currencyToSend, setCurrencyToSend] = useState<number>(0);
    const [currencyMap, setCurrencyMap] = useState(new Map<number, CurrencyMapItem>());
    const [valueToSendBalance, setValueToSendBalance] = useState<ICurrencyNameBalance>({balance: 0, currency:''});
    const [searchPhrase, setSearchPhrase] = useState<string>('');
    const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]);

    const snackbarProps = {
      status: snackStatus,
      icon: <FaExclamation />,
      description: snackMess
  };

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


  useEffect(() =>{

    const delaySearch = setTimeout(async () => {
      if(searchPhrase.trim() === '') {
        setSearchedUsers([]);
        return
      }
      const searchedUsersTemp = await searchUsers(searchPhrase);
      if(searchedUsersTemp.userProfiles.length == 0){
        setSearchedUsers([]);
        return;
      }
      console.log(searchedUsersTemp.userProfiles);
      setSearchedUsers(searchedUsersTemp.userProfiles);
    }, 500);

    return () => clearTimeout(delaySearch);

  },[searchPhrase])


  
  useEffect(() => {
    console.log("Currency Map in useEffect:", currencyMap);
  }, [currencyMap]);

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


const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newCurrency = parseFloat(e.target.value);
  setCurrencyToSend(newCurrency);
  const findCurrencyName = Array.from(currencyMap.entries()).filter(([key, value]) => value.id === newCurrency);
  const findCurrencyBalance = userOwnedCurrencies.filter((currency) => currency.currency_id == newCurrency)
  setValueToSendBalance({balance: findCurrencyBalance[0].amount , currency: findCurrencyName[0][1].name});
  setAmountToChange(0);
};


const handleSearchPhrase = (e: React.ChangeEvent<HTMLInputElement>) => {
  const enteredPhrase = e.target.value;
  setSearchPhrase(enteredPhrase);
}
const setMaximumAmountToSend = () =>{
  setAmountToChange(valueToSendBalance.balance);
}

const displayUserCurrencies = () =>{
    if(!isLoading && userOwnedCurrencies.length == 0){
        return "You have empty wallet!"
    }
    const currencyMapArray = Array.from(currencyMap);
    return(
        <select className="w-1/2 text-black" onChange={handleCurrencyChange}>
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
        <div className='w-3/4 my-4 mz-2 flex items-center flex-col'>
            <h1 className='text-2xl textUnderline'>Hello {userWalletData.first_name} {userWalletData.last_name}</h1>
            <h4 className='text-wrap textUnderline mx-2'>Do you want to send a transfer to another user in our application? It has never been easier than now. With the Bankera app, all you need to do is search for the other user by personal information or email address, choose the amount and the currency you want to send. It's that simple!</h4>
            <div className='flex flex-col items-center w-full'>
                <div className='flex flex-row gap-6 mt-4'>
                {valueToSendBalance.currency !== '' ? 
                    <div className='hover:cursor-pointer' onClick={() => setMaximumAmountToSend()}>
                      <span className="font-bold">Currency Balance: {valueToSendBalance.balance}</span>
                    </div> : null}
                    <div>
                        <label htmlFor="currencyToSend" className="font-bold mr-1 flex items-center justify-center">Currency to send: </label>
                        {displayUserCurrencies()}
                    </div>
                    <div>
                        <label htmlFor="amount" className="font-bold mr-1 flex items-center justify-center mr-2">Amount:</label>
                        <input
                        placeholder="0"
                        id="amount"
                        type="number"
                        min="0"
                        max={valueToSendBalance.balance}
                        className="w-24 font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none ml-2"
                        onChange={handleAmountChange}
                        value={amountToChange}
                        />
                    </div>
                    <div className="relative w-64 mb-16">
                      <div>
                          <label htmlFor="user" className="font-bold mr-1 flex items-center justify-center mr-2">Select User:</label>
                          <input
                          placeholder="Type..."
                          id="user"
                          type="text"
                          className="font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none ml-2"
                          onChange={handleSearchPhrase}
                          value={searchPhrase}
                          />
                      </div>
                    {searchedUsers.length != 0 ? 
                      <div className='absolute text-xs flex flex-col gap-2 max-h-12 overflow-y-auto overflow-x-hidden w-full'>
                        {searchedUsers.map((user)=>(
                          <span key={user.id}>{user.first_name} {user.last_name} - {user.email}</span>
                        ))}
                      </div> 
                      : null}
                  </div>
              </div>
                <button className="py-4 button2 text-white rounded-xl hover:cursor-pointer text-xs w-48 mt-8">Send a transfer</button>
            </div>
        </div>
        }
        </div>
    </Layout>
    )
} 
