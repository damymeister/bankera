import { getCurrencies } from '../api/services/currencyService';
import { getCurrencyStorage } from '../api/services/currencyStorageService';
import { searchUsers } from '../api/services/userSearchService';
import React, { useEffect, useState } from 'react';
import { getWalletData } from '../api/services/walletService';
import Layout from "@/app/layoutPattern";
import {FaExclamation}  from "react-icons/fa";
import SnackBar from '@/components/snackbar'
import '@/components/css/home.css';
import '@/components/css/forms.css';
import { handleCreateUsersTransactions } from '@/pages/api/services/usersTransactionsService';
import { FaWindowClose }  from "react-icons/fa";
import { ICurrencyNameBalance, IUserTransactionValueTypes } from '@/lib/interfaces/userTransaction';
import { IUserSearch } from '@/lib/interfaces/user';
import { IUserTransaction, IWithDrawData, IDataUserToSend } from '@/lib/interfaces/userTransaction';
import {ICurrencyStorage} from '@/lib/interfaces/currencyStorage';
import ICurrency from '@/lib/interfaces/currency';
import {IWallet} from '@/lib/interfaces/wallet';

export default function UsersTransactions() {
    const [userOwnedCurrencies, setUserOwnedCurrencies] = useState<ICurrencyStorage[]>([])
    const [currenciesNames, setCurrenciesNames] = useState<ICurrency[]>([]);
    const [userWalletData, setUserWalletData] =  useState<IWallet>({wallet_id:0, first_name:"", last_name: ""})
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const [currencyMap, setCurrencyMap] = useState(new Map<number, ICurrency>());
    const [valueToSendBalance, setValueToSendBalance] = useState<ICurrencyNameBalance>({balance: 0, currency:''});
    const [searchPhrase, setSearchPhrase] = useState<string>('');
    const [searchedUsers, setSearchedUsers] = useState<IUserSearch[]>([]);
    const [userCliked, setUserCliked] = useState<boolean>(false);
    const [userClikedWallet, setUserClikedWallet] = useState<number>(0);
    const [transferToSend, setTransferToSend] = useState<IUserTransactionValueTypes>({amountToChange: 0.0, currencyToSend:0});
    const [displayComment, setDisplayComment] = useState<boolean>(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  useEffect(()=>{
    const setButtonAvailability = () =>{
      if(!userCliked || transferToSend.amountToChange == 0.0 || transferToSend.currencyToSend == 0){
        setIsButtonDisabled(true);
        return
      }
      setIsButtonDisabled(false);
    }
    setButtonAvailability();
  }, [userCliked, transferToSend.amountToChange, transferToSend.currencyToSend])

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
        const userCurrencies = await getCurrencyStorage();
        setUserOwnedCurrencies(userCurrencies.data);
        setCurrencyMapData(userCurrencies.data, currencies);
        setLoadedCurrentBalance(userCurrencies.data);
    }catch(error){
        setSnackbarProps({snackStatus: "danger", message: "Nie udało się pobrać danych portfela.", showSnackbar: true});
    }finally{
        setIsLoading(false);
    }
}

const setLoadedCurrentBalance = async (userCurrencies : ICurrencyStorage[]) =>{
  const mapArray = Array.from(currencyMap.entries())
  const firstMapElement = mapArray[0];
  const findCurrencyBalance = userCurrencies.filter((currency) => currency.currency_id == firstMapElement[1].id)
  setValueToSendBalance({balance: findCurrencyBalance[0].amount , currency: firstMapElement[1].name});
  setTransferToSend((prevValues) =>({
    ...prevValues,
    currencyToSend: firstMapElement[1].id
  }))
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
      if(searchPhrase.trim() === '' || userCliked) {
        setSearchedUsers([]);
        return
      }
      const searchedUsersTemp = await searchUsers(searchPhrase);
      if(searchedUsersTemp.userProfiles.length == 0){
        if(searchPhrase.length > 0){
          setDisplayComment(true);
        }
        setSearchedUsers([]);
        return;
      }
      const deleteCurrUserWallet = searchedUsersTemp.userProfiles.filter((user: IUserSearch) => user.wallet_id !== userWalletData.wallet_id)
        setDisplayComment(false);
        setSearchedUsers(deleteCurrUserWallet);
    }, 500);

    return () => clearTimeout(delaySearch);

  },[searchPhrase])


  
  useEffect(() => {
    console.log("Currency Map in useEffect:", currencyMap);
  }, [currencyMap]);

  const setCurrencyMapData = (userCurrencies: ICurrencyStorage[], currenciesNames: ICurrency[]) =>{
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
    setTransferToSend((prevValues) =>({
      ...prevValues,
      amountToChange: enteredAmount
    }))
  };


const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newCurrency = parseFloat(e.target.value);
  setTransferToSend((prevValues) =>({
    ...prevValues,
    currencyToSend: newCurrency
  }))
  const findCurrencyName = Array.from(currencyMap.entries()).filter(([key, value]) => value.id === newCurrency);
  const findCurrencyBalance = userOwnedCurrencies.filter((currency) => currency.currency_id == newCurrency)
  setValueToSendBalance({balance: findCurrencyBalance[0].amount , currency: findCurrencyName[0][1].name});
  setTransferToSend((prevValues) =>({
    ...prevValues,
    amountToChange: 0
  }))
};


const handleSearchPhrase = (e: React.ChangeEvent<HTMLInputElement>) => {
  const enteredPhrase = e.target.value;
  setSearchPhrase(enteredPhrase);
}
const setMaximumAmountToSend = () =>{
  setTransferToSend((prevValues) =>({
    ...prevValues,
    amountToChange: valueToSendBalance.balance
  }))
}

const displayUserCurrencies = () =>{
    if(!isLoading && userOwnedCurrencies.length == 0){
        return "You have empty wallet!"
    }
    const currencyMapArray = Array.from(currencyMap);

    return(
        <select className="min-w-16 text-white py-1 pl-2 border focus:bg-[#1f1b24b2] rounded-lg px-1 bgGlass hover:border-[#BB86FC] overflow-y-auto resize-none ml-2" onChange={handleCurrencyChange}>
            {currencyMapArray.map(([key, value])=>(
            <option key = {key} value={value.id}>
                {value.name}
            </option>
            ))}
        </select>
    )
}
const selectedUser = (user: IUserSearch) =>{
  const userData = `${user.first_name} ${user.last_name} - ${user.email}`
  setUserClikedWallet(user.wallet_id);
  setSearchPhrase(userData);
  setUserCliked(true);
  setSearchedUsers([]);
}

const unselectUser = () =>{
  setUserCliked(false);
  setSearchPhrase("");
}

const sendMoneyTransfer = async () => {
  if(!userCliked || transferToSend.amountToChange === 0.0 || transferToSend.currencyToSend === 0){
    return
  }

  try{
    const withDrawData = await withDrawMoneyFromAccount()
    const dataToSendToUser = await transferMoneyToSelectedUser()
    await executeUsersTransactions(withDrawData, dataToSendToUser)
  }catch(error){
    setSnackbarProps({ snackStatus: "danger", message:"Wystąpił błąd podczas wykonywania transakcji.", showSnackbar: true });
   }
  finally{
    resetData();
    loadData();
    setSnackbarProps({ snackStatus: "success", message: "Zlecenie zostało wykonane.", showSnackbar: true });
  }
}

const withDrawMoneyFromAccount = async () => {
      const currencyStorageID = userOwnedCurrencies.filter((currency) => currency.currency_id === transferToSend.currencyToSend)
      const currencyMoneyLeft = currencyStorageID[0].amount - transferToSend.amountToChange;
      if(currencyMoneyLeft < 0){
        setSnackbarProps({ snackStatus: "danger", message: "Nie posiadasz takiej ilości wybranej waluty.", showSnackbar: true });
        setTransferToSend((prevData)=>({
          ...prevData,
          amountToChange: 0.0
        }))
        return
      }
      const withDrawal = {id: currencyStorageID[0].id, amount: transferToSend.amountToChange}
      if (!window.confirm("Czy na pewno chcesz wykonać przelew?")) return
      return withDrawal;
}

const transferMoneyToSelectedUser = async () =>{
  const dataToSend = {
    wallet_id: userClikedWallet,
    amount: transferToSend.amountToChange,
    currency_id: transferToSend.currencyToSend
  }
   return dataToSend
}

const executeUsersTransactions = async (withDrawData?: IWithDrawData , dataToSendToUser?: IDataUserToSend) =>{
  const currDate = new Date();

  const userToUserTransaction = {
    wallet_sender_id: userWalletData.wallet_id,
    wallet_recipient_id: userClikedWallet,
    currency_id: transferToSend.currencyToSend,
    amount: transferToSend.amountToChange,
    transaction_date: currDate
  }
  if (!withDrawData || !dataToSendToUser) {
    setSnackbarProps({ snackStatus: "danger", message: "Niepoprawne dane.", showSnackbar: true });
    return
  }

  const userToUserTransactionRequest : IUserTransaction = 
  {
    userToUserTransaction, 
    withDrawData: withDrawData, 
    dataUserToSend: dataToSendToUser}

  await handleCreateUsersTransactions(userToUserTransactionRequest);
}


const resetData = () =>{
  setSearchedUsers([]);
  setSearchPhrase("");
  setUserCliked(false);
  setTransferToSend(
    {amountToChange: 0.0, currencyToSend:0}
  )
}

    return(
    <Layout>
         {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
        <div className="w-full flex items-center justify-center">
        {isLoading ? <h1>Is loading...</h1> : 
        <div className='w-4/5 my-4 mz-2 flex items-center flex-col containerCustom borderLight bg-[#1f1b249c] p-4'>
            <h1 className='text-2xl textUnderline'>Hello {userWalletData.first_name} {userWalletData.last_name}</h1>
            <h4 className='text-wrap textUnderline mx-2 py-2'>Czy chcesz wysłać przelew do innego użytkownika w naszej aplikacji? Teraz jest to łatwiejsze niż kiedykolwiek wcześniej. Dzięki aplikacji Bankera, wszystko, co musisz zrobić, to wyszukać innego użytkownika za pomocą danych osobowych lub adresu e-mail, wybrać kwotę i walutę. Następnie klikasz przycisk przelej kwotę i to tyle!</h4>
            <div className='flex flex-col w-full items-center justify-center pt-2'>
            <div className='flex flex-col gap-6 4 w-full flex-wrap items-center justify-center'>
              <h2 className='text-wrap text-xl textUnderline mx-2'>Stan konta</h2>
              <div className='flex flex-row items-center justify-center textUnderline py-2'>
                <div className='hover:cursor-pointer ' onClick={() => setMaximumAmountToSend()}>
                  <span className="font-bold pr-4">{valueToSendBalance.currency !== '' ? valueToSendBalance.balance : '-'}</span>
                </div>
                <div className='flex flex-row w-full items-center justify-center'>
                  <label htmlFor="currencyToSend" className="font-bold mr-1 flex items-center justify-center"></label>
                  {displayUserCurrencies()}
                </div>
              </div>
              <div className='flex flex-col items-center justify-center gap-12 bgGlass p-4 rounded-lg'>
              <div className="relative flex flex-wrap mb-6">
                <div className=''>
                  <label htmlFor="user" className="font-bold mr-2 text-left">Użytkownik:</label>
                  <div className='flex flex-row items-center justify-center'>
                    <input
                      placeholder="Type..."
                      id="user"
                      type="text"
                      className="border w-full rounded-md py-1 pl-2 pr-15 focus:text-white sm:text-sm sm:leading-6 bg-[#1f1b24b2]"
                      onChange={handleSearchPhrase}
                      value={searchPhrase}
                      disabled={userCliked}
                    />
                    <div className='w-3'>
                      {userCliked ? 
                        <FaWindowClose onClick={() => unselectUser()} className="ml-1 text-white w-3 inline cursor-pointer hover:text-slate-200" />
                        : null}
                    </div>
                  </div>
                </div>
                <div className='bgdark ml-4 mb-12 absolute rounded-lg text-xs flex flex-col gap-1 max-h-12 overflow-y-auto overflow-x-hidden'>
                  {!displayComment ? (
                    searchedUsers.map((user) => (
                      <span className='hover:cursor-pointer opacity-90 py-1 hover:bg-[#121212] rounded-sm' onClick={() => selectedUser(user)} key={user.id}>
                        {user.first_name} {user.last_name} - {user.email}
                      </span>
                    ))
                  ) : (
                    <span>Brak wyników - zmień frazę wyszukiwania.</span>
                  )}
                </div>
              </div>
              <div className=''>
                <label htmlFor="amount" className="font-bold mr-2 text-left">Kwota:</label>
                <input
                  placeholder="Type..."
                  id="amount"
                  type="number"
                  min="0"
                  max={valueToSendBalance.balance}
                  className="border w-full rounded-md  py-1 pl-2 pr-15 focus:text-white sm:text-sm sm:leading-6 bg-[#1f1b24b2]"
                  onChange={handleAmountChange}
                  value={transferToSend.amountToChange}
                />
              </div>
            </div>
          </div>
              <button
                disabled={isButtonDisabled}
                onClick={sendMoneyTransfer}
                className={`py-4 text-black rounded-xl w-48 mt-8 ${isButtonDisabled ? 'opacity-30 hover:cursor-not-allowed' : 'opacity-100 hover:opacity-80'}`}
                style={{ backgroundColor: '#BB86FC' }}
                >
                  Przelej kwotę
                </button>
            </div>
        </div>
        }
        </div>
    </Layout>
    )
} 
