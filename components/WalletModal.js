import Layout from '@/app/layoutPattern';
import { GrClose } from "react-icons/gr";
import React, { useEffect, useState } from 'react';
import { postCurrencyStorage, updateCurrencyStorage } from '@/pages/api/services/currencyStorageService';


export default function WalletModal(props) {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [data, setData] = useState({ currencyRow_id: null, wallet_id:"", currency_id: "", amount: "" });
  const [amountToChange, setAmountToChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [operationType, setOperationType] = useState(1);
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
    const newCurrentValueBalance = parseFloat(data.amount) + parseFloat(amountToChange);
    if(newCurrentValueBalance > 0){
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
  
  const withDrawMoneyFromAccount = async () =>{
    const newCurrentValueBalance = parseFloat(data.amount) - parseFloat(amountToChange);
    if(newCurrentValueBalance > 0){
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
  
  const addNewCurrency = async () =>{
    const dataCurr = {
      wallet_id : data.wallet_id,
      currency_id : parseInt(data.currency_id),
      amount: parseFloat(amountToChange),
    }
    const res = await postCurrencyStorage(dataCurr);
    setMessage(res.message);
  }
  
const displayButton = () =>{
  if(operationType == 1 && data.currencyRow_id){
    return <button onClick={() => addBalanceToAccount()} className="py-2 button2 text-white rounded-xl w-1/3">Deposit</button>
  }else if(operationType == 2 && data.currencyRow_id){
    return <button onClick={() => withDrawMoneyFromAccount()} className="py-2 button2 text-white rounded-xl w-1/3">Withdraw</button>
  }
  else if(data.currencyRow_id == null){
    return <button onClick={() => addNewCurrency()} className="py-2 button2 text-white rounded-xl w-1/3">Add</button>
  }
}

  return (
    <Layout>
      <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
        <div className="lg:w-1/4 w-2/3 py-2 lg:h-96 min-h-1/3 h-auto bg-white rounded-xl relative border-2 text-black">
          {isLoading ? (
            <div>Is loading...</div>
          ) : (
            <div className="text-black flex flex-col items-center">
              {!data.currencyRow_id ? (
                <div>
                  <p className="font-bold">Choose currency</p>
                  {mapCurrencies()}
                </div>
              ) : null }
              {data.currencyRow_id ? (
                <div>
                  <p className="font-bold">Choose Operation Type</p>
                  <select className="w-1/2" onChange={handleOperationTypeChange} value={operationType}>
                        <option key={1} value={1}>
                              Deposit
                        </option>
                        <option key={2} value={2}>
                              Withdraw
                        </option>
                  </select>
                <p>Current Amount: {data.amount}</p>
                </div>
              ): null}
              <label htmlFor="name" className="font-bold">Amount</label>
              <input
                placeholder="Amount"
                id="name"
                type="number"
                min="0"
                className="mt-4 w-1/2 font-bold border-transparent border-1 focus:border-black overflow-y-auto resize-none"
                onChange={handleAmountChange}
                value={amountToChange}
              />
            {displayButton()}
            {message !== "" ? (<p>{message}</p>) : null}
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


  