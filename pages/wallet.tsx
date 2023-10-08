import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import { getWalletData, handleCreateWallet, handleDeleteWallet, handleEditWallet } from './api/services/walletService';
import { getCurrencies } from './api/services/currencyService';
import WalletModal from '@/components/WalletModal';


export default function Wallet() {
  const [walletData, setWalletData] = useState(null);
  const [error, setError] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState(null);
  const [pickedCurrency, setPickedCurrency] = useState({ currencyRow_id: null, wallet_id:"", currency_id: "", amount: "" })
  const [currenciesToSend, setCurrenciesToSend] = useState([]);

  const fetchWalletData = async () => {
    try {
      const promiseWalletData = await getWalletData();
      const currencyData = await getCurrencies();
      if (promiseWalletData && currencyData) {
        setWalletData(promiseWalletData);
        setCurrencies(currencyData);
        checkRemainingCurrencies(promiseWalletData, currencyData);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('Error fetching wallet data.');
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const checkRemainingCurrencies = (promiseWalletData, currencyData) => {
    const currentCurrencies = promiseWalletData.walletStorage.map(data=> Number(data.currency_id));
    const allCurrencies = currencyData.map(currency => Number(currency.id));
    const currenciesRemaining = allCurrencies.filter( id => !currentCurrencies.includes(id));
    const currenciesToSend = currencyData.filter( data => currenciesRemaining.includes(data.id));
    setCurrenciesToSend(currenciesToSend);
  }

  const closeWalletModal =  () =>{
    setShowWalletModal(false);
    setPickedCurrency({
      currencyRow_id: null,
      wallet_id: "",
      currency_id: "",
      amount: "",
    });
    setCurrenciesToSend([]);
    fetchWalletData();
  }

const setChoosenCurrency = (id, walletID, currencyID, amount) => {
  setPickedCurrency({
    currencyRow_id: id,
    wallet_id: walletID,
    currency_id: currencyID,
    amount: amount,
  });
}

  const findCurrencyName = (currencyID :number) =>{
    var currencyName = null;
    if(currencies !== null){
      for( let i = 0; i < currencies.length; i++){
        if(currencies[i].id === currencyID){
          currencyName = currencies[i].name;
        }
      }
  }
  return currencyName;
}
  const mapUserCurrencies = () => {
    if (!isLoading && walletData !== null && currencies !== null) {

      return (
        <table className='w-full bg-white text-black'>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {walletData.walletStorage.map((currency) => {
            return (
              <tr key={currency.id}>
                <td>{findCurrencyName(currency.currency_id)}</td>
                <td>{currency.amount}</td>
                <td><button onClick={() => {setShowWalletModal(true); setChoosenCurrency(currency.id , currency.wallet_id, currency.currency_id, currency.amount)}}>Edit</button></td>
              </tr>
            );
          })}
          </tbody>
        </table>
      );
    }
    return "Your current wallet balance is 0."; 
  }

  return (
    <Layout>
      <div className="items-center justify-center flex">
        {isLoading ? (<div>Is loading...</div>):
        walletData === null ?
          <div>
            <h3>You do not have a wallet yet! Create one below!</h3>
            <button onClick={() => setShowWalletModal(true) } className="p-4 rounded-xl mt-4 button2 mb-4 cursor-pointer">Create Wallet</button>
          </div> :
          <div className="border-2 bg-inherit border-white rounded-xl m-8">
           <h1>Hello { walletData.first_name } {walletData.last_name}</h1>
           <p>Current balance of you account is shown below</p>
           { mapUserCurrencies() }
          { currenciesToSend.length !== 0 ? (
          <button onClick={() => {setShowWalletModal(true)}}>Deposit new currency into your wallet</button>
          ):(<div>
              <p>You have all of the possibile currencies in your wallet.</p>
            </div>)}
          </div>
        }
      </div>
      {showWalletModal ? 
            <WalletModal walletID = {walletData.walletStorage[0].wallet_id} closeWalletModal={closeWalletModal} currencies={currencies} walletData = {pickedCurrency} currenciesToSend = {currenciesToSend}/>: null
        }
    </Layout>
  );
}

