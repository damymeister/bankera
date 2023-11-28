import Layout from '@/app/layoutPattern';
import '@/components/css/home.css';
import { GrClose } from "react-icons/gr";
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { postCurrencyStorage, updateCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { GoSingleSelect } from "react-icons/go";
import { FaWindowClose, FaMoneyBillWaveAlt}  from "react-icons/fa";
import SnackBar from '@/components/snackbar';
import {FaExclamation}  from "react-icons/fa";

enum Operation {
  Withdraw = 2,
  Deposit = 1
}

export default function WalletModal(props: any) {
  const [currencies, setCurrencies] = useState([]);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ currencyRow_id: -1, wallet_id:"", currency_id: "", amount: -1});
  const [amountToChange, setAmountToChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [operationType, setOperationType] = useState(1);
  const [currencyName, setCurrencyName] = useState(null);

const [showSnackbar, setShowSnackbar] = useState(false)
const [snackMess, setsnackMess] = useState("")
const [snackStatus, setsnackStatus] = useState("danger")

const snackbarProps = {
  status: snackStatus,
  icon: <FaExclamation />,
  description: snackMess
};

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

  useEffect(() => {
    const setupProps = () => {
      if(props.currenciesToSend){
        setCurrencies(props.currenciesToSend);
      }else{
        setCurrencies(props.currencies);
      }

      if (props.walletData.currencyRow_id) {
        setData({
          currencyRow_id: props.walletData.currencyRow_id,
          wallet_id: props.walletData.wallet_id,
          currency_id: props.walletData.currency_id,
          amount: props.walletData.amount,
        });
        setCurrencyName(props.findCurrencyName(props.walletData.currency_id));
      } else {
        setData((dat) => ({
          ...dat,
          wallet_id: props.walletID,
          currency_id: props.currenciesToSend[0].id,
        }));
      }
        setIsLoading(false); 
      }
    ;
    setupProps();
  }, [props.currencies, props.walletData]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const enteredAmount = parseInt(e.target.value);
    setAmountToChange(enteredAmount);
  };

  const handleOperationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const operation = parseInt(e.target.value);
    setOperationType(operation);
  };


  const mapCurrencies = () => {
    return (
      <select className="w-1/2 bgdark" onChange={handleCurrencyChange} value={data.currency_id}>
        {currencies.length !== 0
          ? currencies.map((currency: any) => (
              <option key={currency.id} value={currency.id}>
                {currency.name}
              </option>
            ))
          : <option value="No Currencies">No Currencies</option>}
      </select>
    );
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrencyId = e.target.value;
    setData((prevData) => ({
      ...prevData,
      currency_id: selectedCurrencyId,
    }));
  };

  const addBalanceToAccount = async () =>{
    if(amountToChange === 0){
      setSnackbarProps({snackStatus: "danger", message: "Incorrect value.", showSnackbar: true});
      return;
    }

    const newCurrentValueBalance = data.amount + amountToChange;
    if(newCurrentValueBalance <= 0){
      setSnackbarProps({snackStatus: "danger", message: "You don't have that amount of money.", showSnackbar: true}); 
      setAmountToChange(0);
      return;
    }

    const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
    if (!window.confirm("Czy na pewno chcesz dodać wartości do swojego portfela?")) return
    const res = await updateCurrencyStorage(dataa);
    setData((dat: any) => ({
      ...dat,
      amount: newCurrentValueBalance,
    }));

    setSnackbarProps({snackStatus: "danger", message: res.message, showSnackbar: true});
    setAmountToChange(0);
  }
  
  const withDrawMoneyFromAccount = async () =>{
    if(amountToChange === 0){
      setSnackbarProps({snackStatus: "danger", message: "Incorrect value.", showSnackbar: true});
      return;
    }
    const newCurrentValueBalance = data.amount - amountToChange;
    if(newCurrentValueBalance < 0){
      setSnackbarProps({snackStatus: "danger", message: "You dont have that amount of money.", showSnackbar: true});
      setAmountToChange(0);
      return
    }
      const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
      if (!window.confirm("Czy na pewno chcesz wypłacić pieniądze z konta?")) return
      const res = await updateCurrencyStorage(dataa);
    
        setData((dat: any) => ({
          ...dat,
          amount: newCurrentValueBalance,
        }));
    
      setSnackbarProps({snackStatus: "danger", message: res.message, showSnackbar: true});
      props.closeWalletModal();
      setAmountToChange(0);
  }
  
  const addNewCurrency = async () =>{
    if(amountToChange === 0){
      setSnackbarProps({snackStatus: "danger", message: "Incorrect value.", showSnackbar: true});
      return;
    }
    const dataCurr = {
      wallet_id : parseInt(data.wallet_id),
      currency_id : parseInt(data.currency_id),
      amount: amountToChange,
    }
    if (!window.confirm("Czy na pewno chcesz dodać wartości do swojego portfela?")) return
    const res = await postCurrencyStorage(dataCurr);
    setAmountToChange(0);
    props.closeWalletModal();
    setSnackbarProps({snackStatus: "danger", message: res.message, showSnackbar: true});
  }
  
const displayButton = () =>{
  if(operationType == Operation.Deposit && data.currencyRow_id !== -1){
    return <button onClick={() => addBalanceToAccount()} className="py-4 button2 text-white rounded-xl">Deposit</button>
  }
  else if(operationType == Operation.Withdraw && data.currencyRow_id !== -1){
    return <button onClick={() => withDrawMoneyFromAccount()} className="py-4 button2 text-white rounded-xl">Withdraw</button>
  }
  return <button onClick={() => addNewCurrency()} className="py-4 button2 text-white rounded-xl">Add</button>
}

  return (
    
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 text-white ">
          {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
        <div className="lg:w-2/5 w-2/3 py-2 lg:h-1/3 min-h-2/3 h-auto bgdark text-white rounded-xl relative border-2 border-black borderLight p-6">
          {isLoading ? (
            <div>Is loading...</div>
          ) : (
            <div className="text-white flex flex-col items-center">
            <div className='flex flex-col font-bold mb-4 py-6'>
              <h2 className="text-lg mb-4">Manage your currency wallet</h2>
              { data.amount && currencyName ? (
                <label htmlFor="currentAmount" className="font-bold">
                 <span className="hover:cursor-pointer" onClick={()=>setAmountToChange(data.amount)}>Current Value: {data.amount} {currencyName}</span> 
                </label>
               ) : (null)}
            </div>
              {data.currencyRow_id === -1 ? (
                <div>
                  <p className="font-bold">Choose currency</p>
                  {mapCurrencies()}
                </div>
              ) : null }
              {data.currencyRow_id !== -1 ? (
                <div className='flex flex-row bgdark'>
                 <label htmlFor="operationType" className="font-bold flex flex-row">
                 {/* <GoSingleSelect className = "text-white cursor-pointer text-2xl mr-1"/>  */}
                 <p className='px-2'>Operation:</p>
                 </label>
                  <select
                    id="operationType"
                    className="w-38 font-bold text-white bgdark"
                    onChange={handleOperationTypeChange}
                    value={operationType}
                  >
                    <option key={1} value={1}>Deposit</option>
                    <option key={2} value={2}>Withdraw</option>
                  </select>
                </div>
              ): null}
              <div className='flex flex-row my-6'>
              <label htmlFor="name" className="font-bold mr-1 flex items-center justify-center"><GiMoneyStack className="cursor-pointer text-white text-2xl mr-2 py-4" /> Amount:</label>
                <input
                  placeholder="0"
                  id="name"
                  type="number"
                  min="0"
                  className="w-24 font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none"
                  onChange={handleAmountChange}
                  value={amountToChange}
                />
              </div>
            {displayButton()}
            {message !== "" ? (<p className='font-bold text-black'>{message}</p>) : null}
            </div>
          )}
          <button onClick={() => props.closeWalletModal()} className="absolute right-2 top-2 ">
            <FaWindowClose className="text-white w-6 inline mr-3 cursor-pointer hover:text-slate-200 " />
          </button>
        </div>
      </div>
    
  );  
}


  