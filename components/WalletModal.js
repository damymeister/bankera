import Layout from '@/app/layoutPattern';
import { GrClose } from "react-icons/gr";
import React, { useEffect, useState } from 'react';
import { postCurrencyStorage, updateCurrencyStorage, deleteCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import { GrMoney } from "react-icons/gr";
import { GiMoneyStack } from "react-icons/gi";
import { GoSingleSelect } from "react-icons/go";

export default function WalletModal(props) {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ currencyRow_id: null, wallet_id:"", currency_id: "", amount: "" });
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

  const handleAmountChange = (e) => {
    const enteredAmount = e.target.value;
    setAmountToChange(enteredAmount);
  };

  const handleOperationTypeChange = (e) => {
    const operation = e.target.value;
    setOperationType(operation);
  };


  const mapCurrencies = () => {
    return (
      <select className="w-1/2" onChange={handleCurrencyChange} value={data.currency_id}>
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

  const handleCurrencyChange = (e) => {
    const selectedCurrencyId = e.target.value;
    setData((prevData) => ({
      ...prevData,
      currency_id: selectedCurrencyId,
    }));
  };

  const addBalanceToAccount = async () =>{
    if(parseFloat(amountToChange) === 0){
      setMessage("Incorrect value.")
    }else{
    const newCurrentValueBalance = parseFloat(data.amount) + parseFloat(amountToChange);
    if(newCurrentValueBalance >= 0){
      const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
      const res = await updateCurrencyStorage(dataa);
      if(res.status === 200){
        setData((dat) => ({
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
    if(parseFloat(amountToChange) === 0){
      setMessage("Incorrect value.")
    }else{
    const newCurrentValueBalance = parseFloat(data.amount) - parseFloat(amountToChange);
    if(newCurrentValueBalance >= 0){
      const dataa = {id: data.currencyRow_id, amount: newCurrentValueBalance}
      const res = await updateCurrencyStorage(dataa);
      if(res.status === 200){
        setData((dat) => ({
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
    if(parseFloat(amountToChange) === 0){
      setMessage("Incorrect value.")
    }else{
    const dataCurr = {
      wallet_id : data.wallet_id,
      currency_id : parseInt(data.currency_id),
      amount: parseFloat(amountToChange),
    }
    const res = await postCurrencyStorage(dataCurr);
    setAmountToChange(0);
    setMessage(res.message);
  }
  }
  
const displayButton = () =>{
  if(operationType == 1 && data.currencyRow_id){
    return <button onClick={() => addBalanceToAccount()} className="py-2 button2 text-white font-bold rounded-xl w-1/3">Deposit</button>
  }else if(operationType == 2 && data.currencyRow_id){
    return <button onClick={() => withDrawMoneyFromAccount()} className="py-2 button2 font-sans text-white rounded-xl font-bold w-1/3">Withdraw</button>
  }
  else if(data.currencyRow_id == null){
    return <button onClick={() => addNewCurrency()} className="py-2 button2 text-white rounded-xl font-bold w-1/3">Add</button>
  }
}

  return (
    <Layout>
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
        <div className="lg:w-1/4 w-2/3 py-2 lg:h-64 min-h-1/3 h-auto bg-white rounded-xl relative border-2 text-black border-black">
          {isLoading ? (
            <div>Is loading...</div>
          ) : (
            <div className="text-black flex flex-col items-center">
            <div className='flex flex-row font-bold mb-4'>
              <GrMoney className="cursor-pointer text-2xl mr-3" />
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
                <div className='flex flex-row'>
                 <label htmlFor="operationType" className="font-bold flex flex-row">
                 <GoSingleSelect className = "cursor-pointer text-2xl mr-1"/> 
                 <p>Operation:</p>
                 </label>
                  <select
                    id="operationType"
                    className="w-38 border-1 font-bold"
                    onChange={handleOperationTypeChange}
                    value={operationType}
                  >
                    <option key={1} value={1}>Deposit</option>
                    <option key={2} value={2}>Withdraw</option>
                  </select>
                </div>
              ): null}
              <div className='flex flex-row mt-4'>
                <label htmlFor="name" className="font-bold mr-1 flex flex-row"><GiMoneyStack className = "cursor-pointer text-2xl mr-2"/>Amount:</label>
                <input
                  placeholder="0"
                  id="name"
                  type="number"
                  min="0"
                  className="w-16 font-bold border-transparent border-1 focus:border-black overflow-y-auto resize-none"
                  onChange={handleAmountChange}
                  value={amountToChange}
                />
              </div>
            {displayButton()}
            {message !== "" ? (<p className='font-bold text-black'>{message}</p>) : null}
            </div>
          )}
          <button onClick={() => props.closeWalletModal()} className="absolute right-2 top-2">
            <GrClose className="w-6 inline mr-3 cursor-pointer" />
          </button>
        </div>
      </div>
    </Layout>
  );  
}


  