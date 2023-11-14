import Layout from '@/app/layoutPattern';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import { getCurrencyPair } from './api/services/currencyPairService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from './api/services/walletService';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { handleCreateInnerTransaction } from './api/services/innerTransactionService';
import { updateCurrencyStorage, deleteCurrencyStorage, postCurrencyStorage} from '@/pages/api/services/currencyStorageService';
import { CurrencyPair } from './api/interfaces/currencyPair';
import { ICurrency } from './api/interfaces/currency';
import { IWallet } from './api/interfaces/wallet';
import SnackBar from '@/components/snackbar'
import {FaExclamation}  from "react-icons/fa";
import { ICreateCurrencyStorage } from './api/interfaces/currencyStorage';
import SidePanel from '@/components/sidepanel';

export default function CurrencyExchange(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<any[]>([ {id:0, amount: 0, currency_id: 0, wallet_id : 0, quoteCurrency: 0, value: 0, rate: 0.0, converted_amount: 0.0, currency_pair_id: 0} ])
    const [currenciesNames, setCurrenciesNames] = useState<ICurrency[]>([]);
    const [userWalletData, setUserWalletData] =  useState<IWallet>({wallet_id:0, first_name:"", last_name: ""})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackMess, setsnackMess] = useState("")
    const [snackStatus, setsnackStatus] = useState("danger")
    const snackbarProps = {
      status: snackStatus,
      icon: <FaExclamation />,
      description: snackMess
  };


const loadData = async () =>{
    try{
      const currencies = await getCurrencies();
      if(currencies){
        setCurrenciesNames(currencies);
      }
    
      var walletData = await getWalletData();
      const userCurrencies = await getCurrencyStorage(walletData.wallet_id);
      const newupdatedUserCurrencies = userCurrencies.data.map((data: any) => ({
        id: data.id, 
        amount: data.amount,
        currency_id: data.currency_id,
        wallet_id: data.wallet_id,
        quoteCurrency: 0,
        value: 0,
        rate: 0,
        converted_amount: 0,
        currency_pair_id: 0
      }));

      setUserOwnedCurrencies(newupdatedUserCurrencies);

      setUserWalletData((data) =>({
          ...data,
          wallet_id : walletData.wallet_id,
          firstName : walletData.first_name,
          lastName : walletData.last_name,
      }));
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

const findCurrencyName = (currencyID : number) =>{
    var currencyname = null;
    currenciesNames.forEach(currency => {
        if(currencyID == currency.id){
            currencyname = currency.name;
        }
    });
    return currencyname;
}

const handleValueToExchange = async (e: React.ChangeEvent<HTMLInputElement>, currencyID: number) => {
  const insertedValue = e.target.value;

  const updatedUserOwnedCurrencies = await Promise.all(userOwnedCurrencies.map(async (currency) => {
    if (currency.id === currencyID) {
      const convertedAmount = await setConvertedAmount(parseFloat(insertedValue), currency.rate);
      return {
        ...currency,
        value: parseFloat(insertedValue),
        converted_amount : convertedAmount,
      };
    }
    return currency;
  }));
    setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const displaySelectOfAvailableCurrencies = (currencyID: number, currencyNumber: number) =>{
  const newCurrenciesAvailable = currenciesNames.filter((currency) => currency.id !== currencyID)
  newCurrenciesAvailable.unshift({ id: 0, name: "Select" });
        return (
            <select className="w-1/2 text-black" onChange={(e) => handleCurrencyChange(e, currencyNumber)} >
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
 
const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>, currencyNumber: number) => {
  const selectID = e.target.value;
  const updatedUserOwnedCurrencies = await Promise.all(userOwnedCurrencies.map(async (currency) => {
    const rateReturned = await findCurrencyRate(currency.currency_id, parseInt(selectID));
    if (currency.id == currencyNumber) {
      return {
        ...currency,
        value:0,
        converted_amount: 0.00,
        quoteCurrency: parseInt(selectID),
        rate: rateReturned.rate,
        currency_pair_id: rateReturned.exchangeRateID
      };
    }
    
    return currency
  }));
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const findCurrencyRate = async (ownedCurrencyID: number, currencyToBuyID: number) => {
  var ratetoReturn = {rate: 0.0, exchangeRateID: 0};
  const exChangeRate = await getCurrencyPair(ownedCurrencyID, currencyToBuyID);
  if(exChangeRate.data){
    ratetoReturn.rate = exChangeRate.data.conversion_value;
    ratetoReturn.exchangeRateID = exChangeRate.data.id;
  }
  return ratetoReturn;
}


const setConvertedAmount = async (inputValue: number, currencyRate: number) => {
  return (inputValue * currencyRate).toFixed(2);
}

const checkValues = (index: number) => {
  const currency = userOwnedCurrencies[index];
  return (
    currency.amount !== 0 &&
    currency.currency_id !== 0 &&
    currency.wallet_id !== 0 &&
    currency.quoteCurrency !== 0 &&
    currency.value !== 0 &&
    currency.rate !== 0 &&
    currency.converted_amount !== 0 &&
    currency.currency_pair_id !== 0 && 
    currency.amount >= currency.value
  );
}

const decideAddOrUpdateCurrencyStorage = (index: number) => {
  const targetCurrency = userOwnedCurrencies.find(element => element.currency_id === userOwnedCurrencies[index].quoteCurrency);
  if (targetCurrency) {
    return targetCurrency.id;
  }
  return false;
}

const saveInnerTransaction = async (userCurr: any) =>{
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 2);

  const transactionData: IinnerTransaction = {
    wallet_id: userCurr.wallet_id,
    currency_pair_id: userCurr.currency_pair_id,
    initial_amount: userCurr.value,
    converted_amount: parseFloat(userCurr.converted_amount),
    transaction_date: currentDate,
  }
  return await handleCreateInnerTransaction(transactionData);
}


const saveExchange = async (index: number) => {

  if (!checkValues(index)) {
    setSnackbarProps({ snackStatus: "danger", message: "Wprowadziłeś nieprawidłowe wartości.", showSnackbar: true });
    return;
  }

  if (!window.confirm("Czy na pewno chcesz wymienić tą walutę?")) return

  const userCurr = userOwnedCurrencies[index];
  const newCurrentValueBalance = parseFloat(userCurr.amount) - parseFloat(userCurr.value);
  const dataToSubtract = { id: userCurr.id, amount: parseFloat(newCurrentValueBalance.toFixed(2)) };

  try {
    await updateCurrencyStorage(dataToSubtract);
    if(newCurrentValueBalance === 0){
      await deleteCurrencyStorage(userCurr.id);
    }

    const operation = decideAddOrUpdateCurrencyStorage(index);

    if (operation) {
      const findIndex = userOwnedCurrencies.find((data) => data.id == operation);
      let newCurrBalanceToAdd = parseFloat(findIndex.amount) + parseFloat(userCurr.converted_amount);
      const dataToAdd = { id: operation, amount: parseFloat(newCurrBalanceToAdd.toFixed(2)) };
      await updateCurrencyStorage(dataToAdd);
    } else {
      let newCurrBalanceToAdd = parseFloat(userOwnedCurrencies[index].converted_amount);
      const addNewCurrStorage :ICreateCurrencyStorage = {
        wallet_id: userOwnedCurrencies[index].wallet_id,
        currency_id: userOwnedCurrencies[index].quoteCurrency,
        amount: parseFloat(newCurrBalanceToAdd.toFixed(2)),
      };
      await postCurrencyStorage(addNewCurrStorage);
    }
    const saveTransaction = await saveInnerTransaction(userCurr);
    setSnackbarProps({ snackStatus: 'success', message: saveTransaction.message, showSnackbar: true });
  } catch (error) {
    setSnackbarProps({ snackStatus: "danger", message: "Nie udało się dokonać wymiany.", showSnackbar: true });
  } finally {
    loadData();
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


const setMaxAmountToExchange = async (ind: number) =>{
  const updatedUserOwnedCurrencies = await Promise.all(userOwnedCurrencies.map(async (currency, index) => {
    if(index == ind){
    return {
      ...currency,
      value: currency.amount,
      converted_amount: await setConvertedAmount(currency.amount, currency.rate)
    }};
    return currency;
  }));
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const mapUserCurrencies = () => {
    if (!isLoading && userOwnedCurrencies.length > 0 && currenciesNames.length > 0 )  {
      return (
        
        <div>
          
            <table className='w-full py-4 m-4 borderLightY text-white'>
              <thead>
                <tr>
                  <th>Base Currency</th>
                  <th>Wallet Amount</th>
                  <th>Quote Currency</th>
                  <th>Value</th>
                  <th>Exchange Rate</th>
                  <th>Converted Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userOwnedCurrencies.map((currency, index) => {
                  return (
                    <tr key={currency.id}>
                    <td>{findCurrencyName(currency.currency_id)}</td>
                    <td className='hover:cursor-pointer' onClick={() => setMaxAmountToExchange(index)}>{currency.amount}</td>
                    <td>{displaySelectOfAvailableCurrencies(currency.currency_id, currency.id)}</td>
                    <td className="flex items-center justify-center">
                        <input 
                            className='w-1/2 text-white bg-transparent border-white'
                            placeholder='0'
                            type="number"
                            value={userOwnedCurrencies[index].value}
                            onChange={(e) => handleValueToExchange(e, currency.id)}
                            min="0"
                            max={userOwnedCurrencies[index].amount}
                            disabled={userOwnedCurrencies[index].quoteCurrency === 0} 
                        ></input>
                    </td>
                    <td>{userOwnedCurrencies[index].rate ? userOwnedCurrencies[index].rate.toFixed(2) : "-"}</td>
                    <td>{userOwnedCurrencies[index].converted_amount && !isNaN(userOwnedCurrencies[index].converted_amount) ? <span> {userOwnedCurrencies[index].converted_amount} {findCurrencyName(userOwnedCurrencies[index].quoteCurrency)} </span>: "0.00"}</td>
                    <td onClick={() => saveExchange(index)} className='flex items-center justify-center'><LiaExchangeAltSolid className="text-white cursor-pointer text-2xl" /></td>
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
          <SidePanel></SidePanel>
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
            {isLoading ? (<h1>Please wait...</h1>) : userWalletData ? (
                <div className='m-8'>   <h1 className='text-2xl'>Hello {userWalletData.first_name} {userWalletData.last_name}</h1>
                    <p>You can exchange currencies in your wallet below
                .</p>
                    {mapUserCurrencies()}
                </div>
                ) 
                : null}
        </Layout>
    )
}
