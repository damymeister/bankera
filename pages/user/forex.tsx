import '@/components/css/home.css';
import '@/components/css/dashboard.css';
import '@/components/css/tailwind.css';
import SidePanel from'@/components/sidepanel';
import { useEffect, useState } from 'react';
import Layout from '@/app/layoutPattern';
import SnackBar from '@/components/snackbar'
import ChartExample from '@/components/newchart';
import {FaExclamation}  from "react-icons/fa";
import { getForexWalletData } from '@/pages/api/services/forexWalletService';
import { IForexCurrencyStorage } from '@/lib/interfaces/forexCurrencyStorage';
import { getForexCurrencyStorage } from '../api/services/forexCurrencyStorageService';
import SpeculativeTransactionModal from '@/components/speculativeTransactionModal';
import { handleGetSpeculativeTransactions } from '@/pages/api/services/speculativeTransactionService';
import ICurrency from "@/lib/interfaces/currency";
import { SpeculativeTransaction } from '@/lib/interfaces/speculative_Transaction';

export default function Forex() {
const [isLoading, setIsLoading] = useState(true);
const [ForexWalletID, setForexWalletID] = useState<number>(0);
const [forexWalletData, setForexWalletData] = useState<IForexCurrencyStorage[]>([]);
const [userData, setuserData] = useState({firstName:"", surname: ""})
const [showSpeculativeTransactionModal, setShowSpeculativeTransactionModal] = useState<boolean>(false)
const [sellingCurrency, setSellingCurrency] = useState<ICurrency>({id: -1, name: ''})
const [buyingCurrency, setBuyingCurrency] = useState<ICurrency>({id: -1, name: ''})
const [userSpeculativeTransactions, setUserSpeculativeTransactions] = useState<SpeculativeTransaction []>([]);
// Snackbar states
const [showSnackbar, setShowSnackbar] = useState(false)
const [snackMess, setsnackMess] = useState("")
const [snackStatus, setsnackStatus] = useState("danger")

const fetchForexWalletData = async () => {
    try {
      const forexWalletId = await getForexWalletData();
      let currenciesSaved : {data: IForexCurrencyStorage []} = {data: []}
      currenciesSaved = await getForexCurrencyStorage();
      setForexWalletID(forexWalletId.forex_wallet_id);
      setuserData((data) => ({
        ...data,
        firstName: forexWalletId.first_name,
        surname: forexWalletId.last_name,
      }));
      setForexWalletData(currenciesSaved.data);
      const speculativeTransactions = await handleGetSpeculativeTransactions();
      console.log(speculativeTransactions);
      setUserSpeculativeTransactions(speculativeTransactions);
    } catch (error) {
      console.error('Error while fetching Forex wallet data:', error);
    }
    finally{
      setIsLoading(false);
    }
  };
 
const snackbarProps = {
    status: snackStatus,
    icon: <FaExclamation />,
    description: snackMess
  };
  
  useEffect(()=>{
    setTimeout(()=>{
      setShowSnackbar(false);
     }, 6000)
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

  useEffect(()=>{
    fetchForexWalletData();
  },[])

  const closeSpeculativeTransactionModal =  () =>{
    setShowSpeculativeTransactionModal(false);
    fetchForexWalletData();
  }
  
  const setSellBuyCurrencies = (buyCurrency: ICurrency, sellCurrency: ICurrency) =>{
    setBuyingCurrency(buyCurrency);
    setSellingCurrency(sellCurrency);
  }

  return (
    <Layout>
        {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
      <div className="h-full">
        <SidePanel></SidePanel>
        {isLoading ? (
                <div>Is loading... </div>
              ) : ForexWalletID === 0 ? (
                <h3>You do not have a Forex wallet yet! You need to create it!</h3>
              ) : (
        <div className="bgdark borderLightY p-0 justify-center text-center my-10">
        <h1 className='text-2xl border-[#BB86FC] border-b-2 py-2 my-4'>Hello { userData.firstName } { userData.surname }!</h1>
        <ChartExample setSellBuyCurrencies={setSellBuyCurrencies}/>
          <div className='forexPanel'>
            <div className="items-center justify-center flex h-full w-full flex-col">
                <h1>Twoje transakcje użytkownika</h1>
                <table>
                    <thead>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
                <button onClick={()=>(setShowSpeculativeTransactionModal(true))}>Speculate</button>
            </div>
          </div>
        </div>)}
      </div>
      {showSpeculativeTransactionModal ? (
      <SpeculativeTransactionModal 
        closeSpeculativeTransactionModal={closeSpeculativeTransactionModal} 
        sellingCurrency={sellingCurrency}
        buyingCurrency={buyingCurrency}
        forexWalletID={ForexWalletID}/>
      ): (
        null
      )}
    </Layout>
  );
 }  