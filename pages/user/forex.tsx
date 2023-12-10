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
import { handleGetSpeculativeTransactions, handleEditSpeculativeTransaction } from '@/pages/api/services/speculativeTransactionService';
import ICurrency from "@/lib/interfaces/currency";
import { SpeculativeTransaction } from '@/lib/interfaces/speculative_Transaction';
import {getCurrencyPairById} from '@/pages/api/services/currencyPairService';
import { MdCurrencyExchange } from "react-icons/md";

export default function Forex() {
const [isLoading, setIsLoading] = useState(true);
const [ForexWalletID, setForexWalletID] = useState<number>(0);
const [forexWalletData, setForexWalletData] = useState<IForexCurrencyStorage[]>([]);
const [userData, setuserData] = useState({firstName:"", surname: ""})
const [showSpeculativeTransactionModal, setShowSpeculativeTransactionModal] = useState<boolean>(false)
const [sellingCurrency, setSellingCurrency] = useState<ICurrency>({id: -1, name: ''})
const [buyingCurrency, setBuyingCurrency] = useState<ICurrency>({id: -1, name: ''})
const [userSpeculativeTransactionsOpen, setUserSpeculativeTransactionsOpen] = useState<SpeculativeTransaction []>([]);
const [userSpeculativeTransactionsClosed, setUserSpeculativeTransactionsClosed] = useState<SpeculativeTransaction []>([]);
const [showOpenTransactions, setShowOpenTransactions] = useState<boolean>(true);
const [currencyPairs , setCurrencyPairs] = useState<any[]>([]);
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
      setUserSpeculativeTransactionsOpen(speculativeTransactions);
      separateSpeculativeTransactions(speculativeTransactions);
      findCurrencyPairs(speculativeTransactions);
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

  const separateSpeculativeTransactions = (speculativeTransactions: SpeculativeTransaction []) =>{
    const openTransactions = speculativeTransactions.filter((transaction)=>transaction.exit_course_value === null && transaction.exit_date === null);
    const closedTransactions = speculativeTransactions.filter((transaction)=>transaction.exit_course_value !== null && transaction.exit_date !== null);
    setUserSpeculativeTransactionsOpen(openTransactions);
    setUserSpeculativeTransactionsClosed(closedTransactions);
  }

  
  const setSellBuyCurrencies = (buyCurrency: ICurrency, sellCurrency: ICurrency) =>{
    setBuyingCurrency(buyCurrency);
    setSellingCurrency(sellCurrency);
  }

  const displayTableHeadRow = () =>{
    if(showOpenTransactions){
      return (
        <tr>
          <th>Para walutowa</th>
          <th>Depozyt</th>
          <th>Data wejścia</th>
          <th>Kurs wejścia</th>
          <th>Obecny zysk</th>
          <th>Take profit</th>
          <th>Stop loss</th>
          <th>Zamknij Pozycję</th>
        </tr>
      )
    }
      return (
        <tr>
          <th>Para walutowa</th>
          <th>Depozyt</th>
          <th>Data wejścia</th>
          <th>Kurs wejścia</th>
          <th>Data wyjścia</th>
          <th>Kurs wyjściowy</th>
          <th>Profit</th>
        </tr>
      )
  }

  const findCurrencyPairs = async (SpeculativeTransactions: SpeculativeTransaction []) =>{
    for(let i=0; i<SpeculativeTransactions.length; i++){
      const currencyPairData = await getCurrencyPairById(SpeculativeTransactions[i].currency_pair_id);
      const currencyPairObject = { transactionID: SpeculativeTransactions[i].id, currencyPairID: currencyPairData.data.id, buyCurrency: currencyPairData.data.buy_currency, sellCurrency: currencyPairData.data.sell_currency};
      setCurrencyPairs((currencyPairs)=>[...currencyPairs, currencyPairObject]);
    }
    console.log(currencyPairs);
  }

  const findCurrencyPair = (transactionID: number) =>{ 
    if(transactionID === 0 || currencyPairs.length === 0 || transactionID === undefined) return null;
    const currencyPair = currencyPairs.find((currencyPair)=>currencyPair.transactionID === transactionID);
    if(currencyPair){
      return `${currencyPair.buyCurrency.name}/${currencyPair.sellCurrency.name}`;
    }
    return null;
  }

  const calculateProfitLoss = async (transaction: SpeculativeTransaction) =>{
    const entryCourseValue = transaction.entry_course_value;
    const currRate = await getCurrentRate(transaction.currency_pair_id);
    if(transaction.transaction_type > 2 && transaction.transaction_type < 1){
      setSnackbarProps({ snackStatus: "danger", message: "Niepoprawny ty[ transakcji!", showSnackbar: true });
      return
    }
    if(currRate === null){
      setSnackbarProps({ snackStatus: "danger", message: "Nie można obliczyć zysku!", showSnackbar: true });
      return
    }

    if(transaction.transaction_type === 1){
      return {profitLoss: ((currRate - entryCourseValue)*transaction.transaction_balance).toFixed(2), currentRate: currRate};
    }

    return {profitLoss: ((entryCourseValue - currRate)*transaction.transaction_balance).toFixed(2), currentRate: currRate};
  }

  const closeTransaction = (transaction: SpeculativeTransaction) => async () => {
    var msg = 'Transakcja została zamknięta!';
    var status = 'success'
    if (!window.confirm("Czy na pewno chcesz zamknąć transakcje?")) return;
    
    try {
      const profit_loss_current_rate = await calculateProfitLoss(transaction);
  
      if (!profit_loss_current_rate || profit_loss_current_rate.currentRate === null || profit_loss_current_rate.profitLoss === null) {
        setSnackbarProps({ snackStatus: "danger", message: "Nie można obliczyć zysku!", showSnackbar: true });
        return;
      }
  
      const transactionData = {
        id: transaction.id,
        forex_wallet_id: ForexWalletID,
        exit_date: new Date(),
        exit_course_value: profit_loss_current_rate.currentRate,
        profit_loss: profit_loss_current_rate.profitLoss,
      };
      await handleEditSpeculativeTransaction(transactionData);
      setSnackbarProps({ snackStatus: status, message: msg, showSnackbar: true });
    } catch (error) {
      console.error("Błąd podczas zamykania transakcji", error);
      msg = "Błąd podczas zamykania transakcji";
      status = "danger";
      setSnackbarProps({ snackStatus: status, message: msg, showSnackbar: true });
    }
  };
  

  const getCurrentRate = async (currencyPairID : number) => {
    try {
      const currencyPair = await getCurrencyPairById(currencyPairID);
      if (!currencyPair.data) {
        return;
      }
      return currencyPair.data.conversion_value;
    } catch (error) {
      console.error("Błąd pobierania pary walutowej:", error);
    }
    return null;
  };

  const findCurrencyName = (transactionID: number) =>{
    const currencyPair = currencyPairs.find((currencyPair)=>currencyPair.transactionID === transactionID);
    if(currencyPair){
      return `${currencyPair.buyCurrency.name}`;
    }
    return '-';
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
          <div className='forexPanel m-6'>
            <div className="items-center justify-center flex h-full w-full flex-col gap-6">
                <h1 className='text-2xl border-[#BB86FC] border-b-2 py-2 my-4'>Twoje transakcje</h1>
                <div className='flex flex-row gap-8 w-full items-center justify-center'>
                    <button 
                      className='w-1/5 px-4 py-2 bg-[#BB86FC] hover:bg-[#996dce] text-[white] rounded-md' 
                      style={{backgroundColor: showOpenTransactions ? '#BB86FC' : '#996dce', opacity: showOpenTransactions ? 1 : 0.5}}
                      onClick={()=>(setShowOpenTransactions(true))}>
                      Otwarte
                      </button>
                    <button 
                      className='w-1/5 px-4 py-2 bg-[#BB86FC] hover:bg-[#996dce] text-[white] rounded-md' 
                      style={{backgroundColor: showOpenTransactions ? '#996dce' : '#BB86FC' , opacity: showOpenTransactions ? 0.5 : 1}}
                      onClick={()=>(setShowOpenTransactions(false))}>
                      Zamknięte
                    </button>
            
                </div>
                <table className='w-full overflow-auto'>
                    <thead>
                      {displayTableHeadRow()}
                    </thead>
                    <tbody>
                      {showOpenTransactions ? (
                        userSpeculativeTransactionsOpen.map((transaction) => (
                          <tr className="border" key={transaction.id}>
                            <td>{findCurrencyPair(transaction.id)}</td>
                            <td>{transaction.transaction_balance}</td>
                            <td>{new Date(transaction.entry_date).toLocaleString()}</td>
                            <td>{transaction.entry_course_value.toFixed(5)}</td>
                            <td>Live Profit</td>
                            <td>{transaction.take_profit !== null && transaction.take_profit !== -1 ? transaction.take_profit : '-'}</td>
                            <td>{transaction.stop_loss !== null && transaction.stop_loss !== -1 ? transaction.stop_loss : '-'}</td>
                            <td className='justify-center flex items-center'><MdCurrencyExchange className='hover:cursor-pointer mt-1 inline' onClick={closeTransaction(transaction)} /></td>
                          </tr>
                        ))
                      ) : (
                        userSpeculativeTransactionsClosed.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{findCurrencyPair(transaction.id)}</td>
                            <td>{transaction.transaction_balance}</td>
                            <td>{new Date(transaction.entry_date).toLocaleString()}</td>
                            <td>{transaction.entry_course_value.toFixed(5)}</td>
                            <td>{transaction.exit_date ? transaction.exit_date.toLocaleString() : null}</td>
                            <td>{transaction.exit_course_value?.toFixed(5)}</td>
                            <td>{transaction.profit_loss} {findCurrencyName(transaction.id)}</td>
                          </tr>
                        )))}
                    </tbody>
                </table>
                <button className='button2' onClick={()=>(setShowSpeculativeTransactionModal(true))}>Utwórz transakcję</button>
            </div>
          </div>
        </div>)}
      </div>
      {showSpeculativeTransactionModal ? (
      <SpeculativeTransactionModal 
        closeSpeculativeTransactionModal={closeSpeculativeTransactionModal} 
        sellingCurrency={sellingCurrency}
        buyingCurrency={buyingCurrency}
        forexWalletID={ForexWalletID}
        fetchForexWalletData={fetchForexWalletData}/>
      ): (
        null
      )}
    </Layout>
  );
 }  