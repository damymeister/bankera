import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import { getWalletData, handleCreateWallet, handleDeleteWallet} from '@/pages/api/services/walletService';
import { getCurrencies } from '@/pages/api/services/currencyService';
import { getCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import WalletModal from '@/components/WalletModal';
import ForexWalletModal from '@/components/ForexWalletModal';
import { BsCurrencyExchange } from "react-icons/bs";
import '@/components/css/home.css';
import SidePanel from '@/components/sidepanel';
import { ICurrencyStorage } from '@/lib/interfaces/currencyStorage';
import { checkExistenceOfForexWallet } from '@/pages/api/services/forexWalletService';
// import Loader from '@/components/loader';
//Paginator
import { pageEndIndex, pageStartIndex } from '@/lib/pages';
import Paginator from '@/components/paginator';

export default function Wallet() {
  const [walletData, setWalletData] = useState<ICurrencyStorage[]>([]);
  const [walletID, setWalletID] = useState(null);
  const [error, setError] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showForexWalletModal, setShowForexWalletModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [pickedCurrency, setPickedCurrency] = useState({ currencyRow_id: 0, wallet_id:0, currency_id: 0, amount: 0.00 })
  const [currenciesToSend, setCurrenciesToSend] = useState<any[]>([]);
  const [userData, setuserData] = useState({firstName:"", surname: ""})
  const [returnedForexWalletID, setReturnedForexWalletID] = useState<number>(-1);
      // PAGINATION states
  const [walletDataPage, setWalletDataPage] = useState(0)
  const [walletDataTotalPages, setWalletDataTotalPages] = useState(0)
  const recordsPerPage = 5

  const fetchWalletData = async () => {
    try {
      const returnedForexWalletID = await checkExistenceOfForexWallet();
      setReturnedForexWalletID(returnedForexWalletID.forex_wallet_id);
      const walletId = await getWalletData();
      const currencyData = await getCurrencies();
      let currenciesSaved : {data: any} = {data: []}
  
      currenciesSaved = await getCurrencyStorage();
      setWalletID(walletId.wallet_id);

      setuserData((data) => ({
        ...data,
        firstName: walletId.first_name,
        surname: walletId.last_name,
      }));
      setWalletData(currenciesSaved.data);
      setCurrencies(currencyData);
      checkRemainingCurrencies(currenciesSaved.data, currencyData);
      if(currenciesSaved.data.length > 0){
        setWalletDataPage(1)
        setWalletDataTotalPages(Math.ceil(currenciesSaved.data.length / recordsPerPage))
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

  const closeForexWalletModal =  () =>{
    setShowForexWalletModal(false);
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

const mapUserCurrencies = () =>{
    let rows : JSX.Element[] = [];
    for(let i = pageStartIndex(recordsPerPage, walletDataPage); i < pageEndIndex(recordsPerPage, walletDataPage, walletDataTotalPages, walletData.length); i++){
      rows.push(    
        <tr className='border-b border-gray-700' key={walletData[i].id}>
        <td className='p-2'>{walletData[i].amount}</td>
        <td className='p-2'>{findCurrencyName(walletData[i].currency_id)}</td>
        <td className='flex items-center justify-center p-2'>
          <BsCurrencyExchange
            className="cursor-pointer text-2xl hover:text-slate-200"
            onClick={() => {setShowWalletModal(true); setChoosenCurrency(walletData[i].id , walletData[i].wallet_id, walletData[i].currency_id, walletData[i].amount)}}/></td>
       </tr>)
    }
    return rows;
  }
  return (
    <Layout>
      <SidePanel></SidePanel>
      <div className="containerCustom borderLightY text-white">
      <div className="items-center bg-[#1f1b24b2] justify-center flex h-full w-full">
        {isLoading ? (<div>Is loading... </div>):
        walletID === null ?
          <div>
            <h3>You do not have a wallet yet! Create one below!</h3>
            <button onClick={() => { handleCreateWallet().then(() => window.location.reload()) }} className="p-4 rounded-xl mt-4 button2 mb-4 cursor-pointer ">Create Wallet</button>
          </div> :
          <div className=" p-8 borderLight rounded-xl m-8  min-h-400">
            {!walletData || walletData.length === 0 ? (
           <button onClick={() => {handleDeleteWallet().then(() => window.location.reload()) }} className="w-3/5 px-4 py-2 bg-[#ff0000c0] hover:bg-[#5c2121] text-[white] rounded-md">Delete Wallet</button>) : null }
            <h1 className='text-2xl border-[#BB86FC] border-b-2 py-2 my-4'>Hello { userData.firstName } { userData.surname }!</h1>
           <div className='mt-4 mb-4'>
            {walletData.length > 0 && !isLoading ? (
            <div className='flex flex-col'>
            <p>Current balance of you account is shown below</p>
            <table className='w-full py-6 m-4 borderLightY text-white border-spacing-y-3' >
              <thead>
                <tr>
                  <th>Ilość</th>
                  <th>Waluta</th>
                  <th>Akcja</th>
                </tr>
              </thead>
              <tbody className='py-2'>
              { mapUserCurrencies() }
              </tbody>
            </table>
          </div>) : <span className='mb-4 mt-4 font-bold'>You wallet is empty.</span>}
          </div>
           <div className='flex flex-row gap-4 flex-wrap items-center justify-center'>
          { currenciesToSend.length !== 0 && !isLoading ? (
            <button className='button3' onClick={() => {setShowWalletModal(true)}}>Deposit new currency</button>
            ): null}
            { walletData !== null && walletData.length > 0 && returnedForexWalletID != -1 ? (
            <button className='button3' onClick={() => {setShowForexWalletModal(true)}}>Transfer to Forex Wallet</button>)
            : (null)}
          </div>
          {walletDataTotalPages !== 0 ? (
          <div className='mt-4'>
            <Paginator currentPage={walletDataPage} totalPages={walletDataTotalPages} onPageChange={setWalletDataPage} />
          </div>
          ): null}
        </div>
        }
      </div>
    </div>
      {showWalletModal ? 
            <WalletModal findCurrencyName = {findCurrencyName} walletID = {walletID} closeWalletModal={closeWalletModal} currencies={currencies} walletData = {pickedCurrency} currenciesToSend = {currenciesToSend}/>: null
        }
          {showForexWalletModal   ? 
            <ForexWalletModal closeForexWalletModal={closeForexWalletModal} walletData={walletData} findCurrencyName={findCurrencyName}/>: null
        }
    </Layout>
  );
}

