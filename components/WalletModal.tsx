import Layout from '@/app/layoutPattern';
import '@/components/css/home.css';
import { GrClose } from "react-icons/gr";
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { postCurrencyStorage, updateCurrencyStorage, deleteCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { GoSingleSelect } from "react-icons/go";
import { FaWindowClose, FaMoneyBillWaveAlt}  from "react-icons/fa";

export default function WalletModal(props: any) {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ currencyRow_id: 0, wallet_id:"", currency_id: "", amount: "" });
  const [amountToChange, setAmountToChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [operationType, setOperationType] = useState(1);
  const [currencyName, setCurrencyName] = useState(null);
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
      setMessage("Incorrect value.")
    }else{
    const newCurrentValueBalance = parseFloat(data.amount) + amountToChange;
    if(newCurrentValueBalance >= 0){
      const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
      const res = await updateCurrencyStorage(dataa);
      if(res.status === 200){
        setData((dat: any) => ({
          ...dat,
          amount: newCurrentValueBalance,
        }));
      }
      setMessage(res.message);
    }else{
      setMessage("You do not have that amount of money.");
    }
  }
  setAmountToChange(0);
  }
  
  const withDrawMoneyFromAccount = async () =>{
    if(amountToChange === 0){
      setMessage("Incorrect value.")
    }else{
    const newCurrentValueBalance = parseFloat(data.amount) - amountToChange;
    if(newCurrentValueBalance >= 0){
      const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
      const res = await updateCurrencyStorage(dataa);
      if(res.status === 200){
        setData((dat: any) => ({
          ...dat,
          amount: newCurrentValueBalance,
        }));
      }
      setMessage(res.message);
      if(newCurrentValueBalance == 0 && res.status === 200){
        const resDel = await deleteCurrencyStorage(data.currencyRow_id);
        setMessage(resDel.message);
      }
    }else{
      setMessage("You do not have that amount of money.");
    }
  }
  setAmountToChange(0);
  }
  
  const addNewCurrency = async () =>{
    if(amountToChange === 0){
      setMessage("Incorrect value.")
    }else{
    const dataCurr = {
      wallet_id : parseInt(data.wallet_id),
      currency_id : parseInt(data.currency_id),
      amount: amountToChange,
    }
    const res = await postCurrencyStorage(dataCurr);
    setAmountToChange(0);
    setMessage(res.message);
  }
  }
  
const displayButton = () =>{
  if(operationType == 1 && data.currencyRow_id){
    return <button onClick={() => addBalanceToAccount()} className="py-4 button2 text-white  rounded-xl ">Deposit</button>
  }else if(operationType == 2 && data.currencyRow_id){
    return <button onClick={() => withDrawMoneyFromAccount()} className="py-4 button2  text-white rounded-xl  ">Withdraw</button>
  }
  else if(data.currencyRow_id == null){
    return <button onClick={() => addNewCurrency()} className="py-4 button2 text-white rounded-xl  ">Add</button>
  }
}

  return (
    
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 text-white ">
        <div className="lg:w-2/5 w-2/3 py-2 lg:h-1/3 min-h-2/3 h-auto bgdark text-white rounded-xl relative border-2  border-black borderLight p-6">
          {isLoading ? (
            <div>Is loading...</div>
          ) : (
            <div className="text-white flex flex-col items-center  ">
            <div className='flex flex-row font-bold mb-4 py-6'>
              {/* <FaMoneyBillWaveAlt className="cursor-pointer text-white text-2xl mr-3" /> */}
              <label htmlFor="currentAmount" className="text-lg">
                Current Value: {data.amount} {currencyName ? currencyName : null}
              </label>
            </div>
              {!data.currencyRow_id ? (
                <div>
                  <p className="font-bold">Choose currency</p>
                  {mapCurrencies()}
                </div>
              ) : null }
              {data.currencyRow_id ? (
                <div className='flex flex-row bgdark'>
                 <label htmlFor="operationType" className="font-bold flex flex-row">
                 {/* <GoSingleSelect className = "text-white cursor-pointer text-2xl mr-1"/>  */}
                 <p className='px-2'>Operation:</p>
                 </label>
                  <select
                    id="operationType "
                    className="w-38  font-bold text-white bgdark"
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
                  className="w-24 font-bold  border border-white rounded-lg px-1  bgdark focus:border-black overflow-y-auto resize-none"
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


  