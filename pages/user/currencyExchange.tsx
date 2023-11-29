import Layout from '@/app/layoutPattern';
import { getCurrencies } from '@/pages/api/services/currencyService';
import { getCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import { getCurrencyPair } from '@/pages/api/services/currencyPairService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from '@/pages/api/services/walletService';
import { LiaExchangeAltSolid } from "react-icons/lia";
import { handleCreateInnerTransaction } from '@/pages/api/services/innerTransactionService';
import { updateCurrencyStorage, deleteCurrencyStorage, postCurrencyStorage} from '@/pages/api/services/currencyStorageService';
import SnackBar from '@/components/snackbar'
import {FaExclamation}  from "react-icons/fa";
import SidePanel from '@/components/sidepanel';
import { significantDigits } from '@/lib/currency';
import { ICreateCurrencyStorage } from '@/lib/interfaces/currencyStorage';
import {IInnerTransaction} from '@/lib/interfaces/innerTransaction';
import ICurrencyExchange from '@/lib/interfaces/currencyExchange';
import ICurrency from '@/lib/interfaces/currency';
import {IWallet} from '@/lib/interfaces/wallet';
//Paginator
import { pageEndIndex, pageStartIndex } from '@/lib/pages';
import Paginator from '@/components/paginator';


export default function CurrencyExchange(){
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<ICurrencyExchange[]>([ {id:0, amount: 0, currency_id: 0, wallet_id : 0, quoteCurrency: 0, value: 0, rate: 0.0, converted_amount: 0.0, currency_pair_id: 0} ])
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
  // PAGINATION states
  const [currencyExchangeDataPage, setCurrencyExchangeDataPage] = useState(0)
  const [currencyExchangeTotalPages, setCurrencyExchangeTotalPages] = useState(0)
  const recordsPerPage = 5

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
      if(userCurrencies.data.length > 0){
        setCurrencyExchangeDataPage(1);
        setCurrencyExchangeTotalPages(Math.ceil(userCurrencies.data.length / recordsPerPage))
      }
      setUserWalletData((data) =>({
          ...data,
          wallet_id : walletData.wallet_id,
          first_name : walletData.first_name,
          last_name : walletData.last_name,
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
            <select className=" text-white rounded-md border border-[#bb86fcad] bg-transparent py-1 pl-2 pr-7 focus:ring-2 focus:bg-[#1f1b24b2] focus:ring-inset focus:ring-indigo-600 sm:text-sm" onChange={(e) => handleCurrencyChange(e, currencyNumber)} >
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


const setConvertedAmount = (inputValue: number, currencyRate: number) => {
  return (inputValue * currencyRate);
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

  const transactionData: IInnerTransaction = {
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
  const newCurrentValueBalance = userCurr.amount - userCurr.value;
  const dataToSubtract = { id: userCurr.id, amount: parseFloat(newCurrentValueBalance.toFixed(2)) };

  try {
    await updateCurrencyStorage(dataToSubtract);
    const operation = decideAddOrUpdateCurrencyStorage(index);
    if (operation) {
      const findIndex = userOwnedCurrencies.find((data) => data.id == operation);
      let newCurrBalanceToAdd = (findIndex?.amount ?? 0) + userCurr.converted_amount;
      const dataToAdd = { id: operation, amount: parseFloat(newCurrBalanceToAdd.toFixed(2)) };
      await updateCurrencyStorage(dataToAdd);
    } else {
      let newCurrBalanceToAdd = userOwnedCurrencies[index].converted_amount;
      const addNewCurrStorage : ICreateCurrencyStorage = {
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
      converted_amount: setConvertedAmount(currency.amount, currency.rate)
    }};
    return currency;
  }));
  setUserOwnedCurrencies(updatedUserOwnedCurrencies);
}

const mapUserCurrencies = () => {
    if (!isLoading && userOwnedCurrencies.length > 0 && currenciesNames.length > 0 )  {
      let rows : JSX.Element [] = [];
      for(let i = pageStartIndex(recordsPerPage, currencyExchangeDataPage); i < pageEndIndex(recordsPerPage, currencyExchangeDataPage, currencyExchangeTotalPages, userOwnedCurrencies.length); i++ ){
        rows.push(
          <tr key={userOwnedCurrencies[i].id} className='border-b border-gray-700'>
            <td className='p-2'>{findCurrencyName(userOwnedCurrencies[i].currency_id)}</td>
            <td className='hover:cursor-pointer pt-2' onClick={() => setMaxAmountToExchange(i)}>{userOwnedCurrencies[i].amount}</td>
            <td className='p-2'>{displaySelectOfAvailableCurrencies(userOwnedCurrencies[i].currency_id, userOwnedCurrencies[i].id)}</td>
            <td className="flex items-center justify-center p-2  inset-y-0 right-0">
              <input
                className='w-1/2 rounded-md border border-[#bb86fcad] py-1 pl-2 pr-15 ring-1 ring-inset focus:ring-2 focus:text-white focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-[#1f1b24b2]'
                placeholder='0'
                type="number"
                value={userOwnedCurrencies[i].value}
                onChange={(e) => handleValueToExchange(e, userOwnedCurrencies[i].id)}
                min="0"
                max={userOwnedCurrencies[i].amount}
                disabled={userOwnedCurrencies[i].quoteCurrency === 0}
              ></input>
            </td>
            <td className='p-2'>{userOwnedCurrencies[i].rate ? userOwnedCurrencies[i].rate.toFixed(significantDigits(userOwnedCurrencies[i].rate)) : "-"}</td>
            <td className='p-2'>{
              userOwnedCurrencies[i].converted_amount && !isNaN(userOwnedCurrencies[i].converted_amount) ?
                <span> {userOwnedCurrencies[i].converted_amount.toFixed(significantDigits(userOwnedCurrencies[i].converted_amount))} {findCurrencyName(userOwnedCurrencies[i].quoteCurrency)} </span>
                : "0.00"
            }</td>
            <td onClick={() => saveExchange(i)} className='flex items-center justify-center p-2'><div className="text-[#bb86fcad] p-2 border border-[#bb86fcad] hover:border-[#BB86FC] rounded-lg hover:text-[#BB86FC] cursor-pointer text-sm" >Wymień</div></td>
        </tr>
        )
      }
      return rows;
    }
  };
    return(
        <Layout>
          <SidePanel></SidePanel>
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
            {isLoading ? (<h1>Please wait...</h1>) : userWalletData.wallet_id !== 0 ? (
                <div className='m-8'>   <h1 className='text-2xl'>Hello {userWalletData.first_name} {userWalletData.last_name}</h1>
                <div className='containerCustom borderLight p-4'>
                  <div className='overflow-x-auto'>
                  <p className='font-bold mb-2'>You can exchange currencies in your wallet below</p>
                  {!isLoading && userOwnedCurrencies.length > 0 ? (
                  <div className='flex flex-row'>
                  <table className='w-full text-white'>
                    <thead className='textUnderline'>
                      <tr>
                        <th className='md:sticky md:left-0'>Base Currency</th>
                        <th>Wallet Amount</th>
                        <th>Quote Currency</th>
                        <th>Value</th>
                        <th>Exchange Rate</th>
                        <th>Converted Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className=''>
                      { mapUserCurrencies() }
                    </tbody>
                  </table>
                  </div>) : <span className='font-bold mt-4 mb-4'>Your wallet is empty!</span>}
                </div>
            </div>
            {currencyExchangeTotalPages !== 0 ? (
                <div className='mt-4'>
                  <Paginator currentPage={currencyExchangeDataPage} totalPages={currencyExchangeTotalPages} onPageChange={setCurrencyExchangeDataPage} />
                </div>) : null}
              </div>
                ) 
                : null}
        </Layout>
    )
}
