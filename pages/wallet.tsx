import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import { getWalletData, handleCreateWallet, handleDeleteWallet} from './api/services/walletService';
import { getCurrencies } from './api/services/currencyService';
import { getCurrencyStorage } from './api/services/currencyStorageService';
import WalletModal from '@/components/WalletModal';
import { BsCurrencyExchange } from "react-icons/bs";
import '@/components/css/home.css';

export default function Wallet() {
  const [walletData, setWalletData] = useState<any[]>([]);
  const [walletID, setWalletID] = useState(null);
  const [error, setError] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [pickedCurrency, setPickedCurrency] = useState({ currencyRow_id: 0, wallet_id:0, currency_id: 0, amount: 0.00 })
  const [currenciesToSend, setCurrenciesToSend] = useState<any[]>([]);
  const [userData, setuserData] = useState({firstName:"", surname: ""})

  const fetchWalletData = async () => {
    try {
      const walletId = await getWalletData();
      const currencyData = await getCurrencies();
      let currenciesSaved : {data: any} = {data: []}
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

  const checkRemainingCurrencies = (promiseWalletData: any[], currencyData : any[]) => {
    const currentCurrencies = promiseWalletData.map(data=> Number(data.currency_id));
    const allCurrencies = currencyData.map(currency => Number(currency.id));
    const currenciesRemaining = allCurrencies.filter( id => !currentCurrencies.includes(id));
    const currenciesToSend = currencyData.filter( data => currenciesRemaining.includes(data.id));
    setCurrenciesToSend(currenciesToSend);
  }

  const closeWalletModal =  () =>{
    setShowWalletModal(false);
    setPickedCurrency({
      currencyRow_id: 0,
      wallet_id: 0,
      currency_id: 0,
      amount: 0.00,
    });
    setCurrenciesToSend([]);
    fetchWalletData();
  }

const setChoosenCurrency = (id: number, walletID: number, currencyID: number, amount: number) => {
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
          <table className='w-full py-6 m-4 borderLightY text-white border-spacing-y-3' >
            <thead>
              <tr>
                <th>Currency</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className='py-2'>
              {walletData.map((currency) => {
                return (
                  <tr className='' key={currency.id}>
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
      <div className="containerCustom borderLightY text-white">
      <div className="items-center bg-[#1f1b24b2] justify-center flex h-full w-full">
        {isLoading ? (<div>Is loading...</div>):
        walletID === null ?
          <div>
            <h3>You do not have a wallet yet! Create one below!</h3>
            <button onClick={() => { handleCreateWallet().then(() => window.location.reload()) }} className="p-4 rounded-xl mt-4 button2 mb-4 cursor-pointer ">Create Wallet</button>
          </div> :
          <div className=" p-8 borderLight rounded-xl m-8 containerCustom min-h-400">
            {!walletData || walletData.length === 0 ? (
           <button onClick={() => {handleDeleteWallet(walletID).then(() => window.location.reload()) }} className="w-3/5 px-4 py-2 bg-[#ff0000c0] hover:bg-[#5c2121] text-[white] rounded-md">Delete Wallet</button>) : null }
           <h1 className='text-2xl   border-[#BB86FC] border-b-2 py-2 my-4'>Hello { userData.firstName } { userData.surname }!</h1>
           <p>Current balance of you account is shown below</p>
           { mapUserCurrencies() }
          { currenciesToSend.length !== 0 ? (
          <button className='button3' onClick={() => {setShowWalletModal(true)}}>Deposit new currency</button>
          ):(<div>
              <p>You have all of the possibile currencies in your wallet.</p>
            </div>)}
          </div>
        }
      </div>
    </div>
      {showWalletModal ? 
            <WalletModal findCurrencyName = {findCurrencyName} walletID = {walletID} closeWalletModal={closeWalletModal} currencies={currencies} walletData = {pickedCurrency} currenciesToSend = {currenciesToSend}/>: null
        }
    </Layout>
  );
}

