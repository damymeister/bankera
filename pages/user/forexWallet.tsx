import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import ForexWalletModal from '@/components/ForexWalletModal';
import '@/components/css/home.css';
import SidePanel from '@/components/sidepanel';
import { handleCreateForexWallet, handleDeleteForexWallet, getForexWalletData} from '@/pages/api/services/forexWalletService';
import { getCurrencies } from '@/pages/api/services/currencyService';
import { IForexCurrencyStorage } from '@/lib/interfaces/forexCurrencyStorage';
import { getForexCurrencyStorage } from '../api/services/forexCurrencyStorageService';
import { checkExistenceOfWallet } from '@/pages/api/services/walletService';
//Paginator
import { pageEndIndex, pageStartIndex } from '@/lib/pages';
import Paginator from '@/components/paginator';


export default function ForexWallet() {
    const [showForexWalletModal, setShowForexWalletModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [ForexWalletID, setForexWalletID] = useState<number>(0);
    const [forexWalletData, setForexWalletData] = useState<IForexCurrencyStorage[]>([]);
    const [userData, setuserData] = useState({firstName:"", surname: ""})
    const [returnedWalletID, setReturnedalletID] = useState<number>(-1);
    // PAGINATION states
    const [forexWalletDataPage, setForexWalletDataPage] = useState(0)
    const [forexWalletDataTotalPages, setForexWalletDataTotalPages] = useState(0)
    const recordsPerPage = 5


    const fetchWalletData = async () => {
        try {
          const forexWalletId = await getForexWalletData();
          const currencyData = await getCurrencies();
          let currenciesSaved : {data: IForexCurrencyStorage []} = {data: []}
          const ifWalletExist = await checkExistenceOfWallet();
          setReturnedalletID(ifWalletExist.wallet_id);
          currenciesSaved = await getForexCurrencyStorage(forexWalletId.forex_wallet_id);
          setForexWalletID(forexWalletId.forex_wallet_id);
          setuserData((data) => ({
            ...data,
            firstName: forexWalletId.first_name,
            surname: forexWalletId.last_name,
          }));
          setForexWalletData(currenciesSaved.data);
          setCurrencies(currencyData);
          if(currenciesSaved.data.length > 0){
            setForexWalletDataPage(1)
            setForexWalletDataTotalPages(Math.ceil(currenciesSaved.data.length / recordsPerPage))
          }
        } catch (error) {
          console.error('Error while fetching wallet data:', error);
        }
        finally{
          setIsLoading(false);
        }
      };
    
      useEffect(() => {
        fetchWalletData();
      }, []);
      
  const closeForexWalletModal =  () =>{
    setShowForexWalletModal(false);
    fetchWalletData();
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
    if (!isLoading && forexWalletData !== null && currencies !== null) {
      let rows : JSX.Element [] = []
      for(let i = pageStartIndex(recordsPerPage, forexWalletDataPage); i < pageEndIndex(recordsPerPage, forexWalletDataPage, forexWalletDataTotalPages, forexWalletData.length); i++){
        rows.push(
          <tr className='' key={forexWalletData[i].id}>
            <td>{findCurrencyName(forexWalletData[i].forex_currency_id)}</td>
            <td>{forexWalletData[i].forex_currency_amount}</td>
          </tr>
        )
      }
      return rows;
    }
    return "Your current wallet balance is 0.";
  };
  return (
    <Layout>
      <SidePanel></SidePanel>
      <div className="containerCustom borderLightY text-white">
      <div className="items-center bg-[#1f1b24b2] justify-center flex h-full w-full">
        {isLoading ? (<div>Is loading... </div>):
        ForexWalletID === 0 ?
          <div>
            <h3>You do not have a Forex wallet yet! Create one below!</h3>
            <button onClick={() => { handleCreateForexWallet().then(() => window.location.reload()) }} className="p-4 rounded-xl mt-4 button2 mb-4 cursor-pointer ">Create Forex Wallet</button>
          </div> :
          <div className=" p-8 borderLight rounded-xl m-8  min-h-400">
            {!forexWalletData || forexWalletData.length === 0 ? (
           <button onClick={() => { handleDeleteForexWallet().then(() => window.location.reload()) }} className="w-3/5 px-4 py-2 bg-[#ff0000c0] hover:bg-[#5c2121] text-[white] rounded-md">Delete Forex Wallet</button>) : null }
           <h1 className='text-2xl border-[#BB86FC] border-b-2 py-2 my-4'>Hello { userData.firstName } { userData.surname }!</h1>
           <div className='mt-4 mb-4'>
            {forexWalletData.length > 0 && !isLoading ? (
            <div className='flex flex-col'>
            <p>Current balance of you account is shown below</p>
            <table className='w-full py-6 m-4 borderLightY text-white border-spacing-y-3' >
              <thead>
                <tr>
                  <th>Ilość</th>
                  <th>Waluta</th>
                </tr>
              </thead>
              <tbody className='py-2'>
              { mapUserCurrencies() }
              </tbody>
            </table>
          </div>) : <span className='mb-4 mt-4 font-bold'>Your Forex wallet is empty.</span>}
          </div>
            <div className='flex flex-row gap-4 flex-wrap justify-center items-center'>
               {forexWalletData.length > 0 && returnedWalletID !== -1 ? (
                <button className='button3' onClick={() => {setShowForexWalletModal(true)}}>Transfer to Wallet</button>
                ) : 
                null}
            </div>
            {forexWalletDataTotalPages !== 0 ? (
            <div className='mt-4'>
              <Paginator currentPage={forexWalletDataPage} totalPages={forexWalletDataTotalPages} onPageChange={setForexWalletDataPage}/>
            </div>
            ) : null}
        </div>
        }
      </div>
    </div>
          {showForexWalletModal ? 
            <ForexWalletModal closeForexWalletModal={closeForexWalletModal} walletData={forexWalletData} findCurrencyName={findCurrencyName} isForexWallet={true}/>: null
        }
    </Layout>
  );
}

