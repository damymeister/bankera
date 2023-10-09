import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import { getWalletData, handleCreateWallet, handleDeleteWallet} from './api/services/walletService';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import WalletModal from '@/components/WalletModal';
import { BsCurrencyExchange } from "react-icons/bs";

export default function Wallet() {
  const [walletData, setWalletData] = useState(null);
  const [walletID, setWalletID] = useState(null);
  const [error, setError] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState(null);
  const [pickedCurrency, setPickedCurrency] = useState({ currencyRow_id: null, wallet_id:"", currency_id: "", amount: "" })
  const [currenciesToSend, setCurrenciesToSend] = useState([]);
  const [userData, setuserData] = useState({firstName:"", surname: ""})

  const fetchWalletData = async () => {
    try {
      const walletId = await getWalletData();
      const currencyData = await getCurrencies();
      var currenciesSaved = []
      if(walletId.wallet_id){

        currenciesSaved = await getCurrencyStorage(walletId.wallet_id);
        setWalletID(walletId.wallet_id);

        setuserData((data) => ({
          ...data,
          firstName: walletId.first_name,
          surname: walletId.last_name,
        }));

        if(currenciesSaved){
          setWalletData(currenciesSaved.data);
        }
      }
      if (currencyData) {
        setCurrencies(currencyData);
        checkRemainingCurrencies(currenciesSaved.data, currencyData);
      }
    } catch (error) {
      console.error('Error while fetching wallet data:', error);
      setError('Error while fetching wallet data.');
    }
    finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const checkRemainingCurrencies = (promiseWalletData, currencyData) => {
    const currentCurrencies = promiseWalletData.map(data=> Number(data.currency_id));
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
      <div>
          <table className='w-full bg-white text-black'>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {walletData.map((currency) => {
                return (
                  <tr key={currency.id}>
                    <td>{findCurrencyName(currency.currency_id)}</td>
                    <td>{currency.amount}</td>
                    <td className='flex items-center justify-center'>
                      <BsCurrencyExchange
                        className="cursor-pointer text-2xl"
                        onClick={() => {setShowWalletModal(true); setChoosenCurrency(currency.id , currency.wallet_id, currency.currency_id, currency.amount)}}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
      </div>
    );
  }
  return "Your current wallet balance is 0.";
};


  return (
    <Layout>
      <div className="items-center justify-center flex h-full w-full">
        {isLoading ? (<div>Is loading...</div>):
        walletID === null ?
          <div>
            <h3>You do not have a wallet yet! Create one below!</h3>
            <button onClick={() => { handleCreateWallet().then(() => window.location.reload()) }} className="p-4 rounded-xl mt-4 button2 mb-4 cursor-pointer ">Create Wallet</button>
          </div> :
          <div className="border-2 bg-inherit border-white rounded-xl m-8 containerCustom min-h-400">
            {!walletData || walletData.length === 0 ? (
           <button onClick={() => {handleDeleteWallet(walletID).then(() => window.location.reload()) }} className="p-4 rounded-xl mt-4 mb-4 bg-white cursor-pointer text-black font-bold hover:bg-slate-300">Delete Wallet</button>) : null }
           <h1>Hello { userData.firstName } { userData.surname }</h1>
           <p>Current balance of you account is shown below</p>
           { mapUserCurrencies() }
          { currenciesToSend.length !== 0 ? (
          <button className='p-4 rounded-xl mt-4 mb-4 bg-white cursor-pointer text-black font-bold hover:bg-slate-300' onClick={() => {setShowWalletModal(true)}}>Deposit new currency into your wallet</button>
          ):(<div>
              <p>You have all of the possibile currencies in your wallet.</p>
            </div>)}
          </div>
        }
      </div>
      {showWalletModal ? 
            <WalletModal findCurrencyName = {findCurrencyName} walletID = {walletID} closeWalletModal={closeWalletModal} currencies={currencies} walletData = {pickedCurrency} currenciesToSend = {currenciesToSend}/>: null
        }
    </Layout>
  );
}

