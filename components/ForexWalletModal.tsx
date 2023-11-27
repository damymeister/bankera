import '@/components/css/home.css';
import React, { useEffect, useState } from 'react';
import { updateCurrencyStorageForexOperations } from '@/pages/api/services/currencyStorageService';
import { updateForexCurrencyStorageForexOperations } from '@/pages/api/services/forexCurrencyStorageService';
import { GiMoneyStack } from "react-icons/gi";
import { FaWindowClose }  from "react-icons/fa";
import SnackBar from '@/components/snackbar';
import { FaExclamation }  from "react-icons/fa";
import { IUpdateSelectedStorage, ClickedCurrency} from '@/lib/interfaces/currencyStorage';
import { checkExistenceOfForexWallet } from '@/pages/api/services/forexWalletService';
import { checkExistenceOfWallet } from '@/pages/api/services/walletService';
import { handleCreateWalletForexWalletTransactions } from '@/pages/api/services/walletForexWalletTransactions';
import { userWalletForexWallet } from '@/lib/interfaces/walletForexWalletTransactions';
import { IForexCurrencyStorage } from '@/lib/interfaces/forexCurrencyStorage';

enum WalletOperation {
  Withdraw = "withdraw",
  Deposit = "deposit"
}

export default function ForexWalletModal(props:any){
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const [amountToChange, setAmountToChange] = useState<number>(0.0);
    const [currencyToSend, setCurrencyToSend] = useState<number>(0);
    const [userWallets, setUserWallets] = useState<userWalletForexWallet>({forex_wallet_id:0, wallet_id:0});
    const [clickedCurrencyData, setClickedCurrencyData] = useState<ClickedCurrency>({
      clickedCurrencyAmount: -1.0,
      clickedCurrencyName: '',
      clickedCurrencyStorageID: -1,
      clickedCurrencyCurrencyID: -1,
    });

    const snackbarProps = {
    status: snackStatus,
    icon: <FaExclamation />,
    description: snackMess
    };

    useEffect(()=>{
    setTimeout(()=>{
        setShowSnackbar(false);
    }, 4000)
    },[showSnackbar])

    useEffect(()=>{
      setClickedCurrencyData(() => ({
        clickedCurrencyAmount: props.isForexWallet ? props.walletData[0].forex_currency_amount : props.walletData[0].amount,
        clickedCurrencyName: props.isForexWallet ? props.findCurrencyName(props.walletData[0].forex_currency_id) : props.findCurrencyName(props.walletData[0].currency_id) ,
        clickedCurrencyStorageID: props.walletData[0].id,
        clickedCurrencyCurrencyID: props.isForexWallet ? props.walletData[0].forex_currency_id : props.walletData[0].currency_id
      }));
      loadWalletsID();
    },[])

    const loadWalletsID = async () =>{
      const returnedForexWalletID = await checkExistenceOfForexWallet();
      const returnedWalletID = await checkExistenceOfWallet();

      setUserWallets(()=>({
        forex_wallet_id: returnedForexWalletID.forex_wallet_id,
        wallet_id: returnedWalletID.wallet_id,
      }))

    }
  
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const insertedValue = e.target.value;
      setAmountToChange(parseFloat(insertedValue));
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const insertedValue = e.target.value;
      setCurrencyToSend(parseInt(insertedValue));
      const currentCurrency = props.walletData.filter((data: any) => data.id == parseInt(insertedValue));
      setClickedCurrencyData(() => ({
        clickedCurrencyAmount: props.isForexWallet ? currentCurrency[0].forex_currency_amount : currentCurrency[0].amount,
        clickedCurrencyName: props.isForexWallet ? props.findCurrencyName(currentCurrency[0].forex_currency_id) : props.findCurrencyName(currentCurrency[0].currency_id),
        clickedCurrencyStorageID: currentCurrency[0].id,
        clickedCurrencyCurrencyID: props.isForexWallet ? currentCurrency[0].forex_currency_id : currentCurrency[0].currency_id
      }));
    }

    const mapUserOwnedCurrencies = () =>{
      if(!props.walletData || props.walletData.length == 0){
        return "Nie posiadasz żadnych walut w portfelu."
      }

      const userCurrencies = props.walletData;
        return(
          <select className='bgdark' value={currencyToSend} onChange={handleCurrencyChange}>
            {userCurrencies.map((data : any) =>{
              return(
                <option key={data.id} value={data.id}>
                  {props.isForexWallet ? props.findCurrencyName(data.forex_currency_id) : props.findCurrencyName(data.currency_id)}
                </option>
              )
            })}
          </select>
        )
    }
    const checkIfOperationPermitted = () => {
      if(amountToChange == 0 || amountToChange == 0.0 || amountToChange > clickedCurrencyData.clickedCurrencyAmount){
        return false
      }
      return true
    }

    const transferMoneyToForex = async () =>{
      if(!checkIfOperationPermitted()){
        setSnackbarProps({ snackStatus: "danger", message: "Wprowadziłeś nieprawidłowe wartości.", showSnackbar: true });
        return
      }
      try{
        if (!window.confirm("Czy na pewno chcesz przelać pieniądze do portfela Forex?")) return
        if(userWallets.forex_wallet_id <=0 || userWallets.forex_wallet_id == undefined || userWallets.forex_wallet_id == null){
          setSnackbarProps({ snackStatus: "danger", message: "Portfel Forex użytkownika nie istnieje!.", showSnackbar: true });
          return
        }
        await updateCasualWallet(userWallets.wallet_id, WalletOperation.Withdraw)
        await updateForexWallet(userWallets.forex_wallet_id, WalletOperation.Deposit)
        await informWalletForexWalletTransactions(userWallets.forex_wallet_id, userWallets.wallet_id)
        props.closeForexWalletModal();
        setSnackbarProps({ snackStatus: "danger", message: "Dodano wartości do portfela Forex.", showSnackbar: true });
      }catch(error){
        console.log(error);
        setSnackbarProps({ snackStatus: "danger", message: "Wystąpił błąd podczas wykonywania transferu.", showSnackbar: true });
      }
    }

    const transferMoneyToCasualWallet = async () =>{
      if(!checkIfOperationPermitted()){
        setSnackbarProps({ snackStatus: "danger", message: "Wprowadziłeś nieprawidłowe wartości.", showSnackbar: true });
        return
      }
      try{
        if (!window.confirm("Czy na pewno chcesz przelać pieniądze do portfela Forex?")) return
        if(userWallets.wallet_id <=0 || userWallets.wallet_id == undefined || userWallets.wallet_id == null){
          setSnackbarProps({ snackStatus: "danger", message: "Portfel użytkownika nie istnieje!.", showSnackbar: true });
          return
        }
        await updateForexWallet(userWallets.forex_wallet_id, WalletOperation.Withdraw)
        await updateCasualWallet(userWallets.wallet_id, WalletOperation.Deposit)
        await informWalletForexWalletTransactions(userWallets.forex_wallet_id, userWallets.wallet_id)
        props.closeForexWalletModal();
        setSnackbarProps({ snackStatus: "danger", message: "Dodano wartości do portfela.", showSnackbar: true });
      }catch(error){
        console.log(error);
        setSnackbarProps({ snackStatus: "danger", message: "Wystąpił błąd podczas wykonywania transferu.", showSnackbar: true });
      }
    }

    const updateCasualWallet = async (walletID: number, accountOperation: WalletOperation) =>{
      let dataToSend : IUpdateSelectedStorage = {wallet_id: walletID, currency_id: clickedCurrencyData.clickedCurrencyCurrencyID, amount: amountToChange, accountOperation: accountOperation};
      await updateCurrencyStorageForexOperations(dataToSend);
      setAmountToChange(0.0);
    }

    const updateForexWallet = async (forexID:number, accountOperation: WalletOperation) =>{
      let dataToSend : IForexCurrencyStorage = {forex_wallet_id: forexID, forex_currency_id: clickedCurrencyData.clickedCurrencyCurrencyID, forex_currency_amount: amountToChange, accountOperation: accountOperation};
      await updateForexCurrencyStorageForexOperations(dataToSend);
      setAmountToChange(0.0);
    }
    
    const informWalletForexWalletTransactions = async (forexID: number, walletID:number) =>{
      const currDate = new Date();

      const WalletForexWalletTransaction = {
        amount: amountToChange,
        forex_wallet_id: forexID,
        wallet_id: walletID,
        currency_id: clickedCurrencyData.clickedCurrencyCurrencyID,
        transaction_date: currDate
      }
      await handleCreateWalletForexWalletTransactions(WalletForexWalletTransaction);
    }

    const setSnackbarProps = ({ snackStatus, message, showSnackbar }: { snackStatus: string, message: string, showSnackbar?: boolean }) => {
      if (snackStatus && message) {
        setsnackStatus(snackStatus);
        setsnackMess(message);
  
        if (showSnackbar !== undefined) {
          setShowSnackbar(showSnackbar);
        }
    };
  }
    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 text-white ">
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
          <div className="lg:w-2/5 w-2/3 py-2 lg:h-1/3 min-h-2/3 h-auto bgdark text-white rounded-xl relative border-2 border-black borderLight p-6">
              <div className="text-white flex flex-col items-center">
              <div className='flex flex-col font-bold mb-4 py-6'>
              <h2 className="text-lg mb-4">Manage your Forex Wallet</h2>
                <label htmlFor="currentAmount" className="font-bold">
                  Current Value: {clickedCurrencyData.clickedCurrencyAmount === -1.0 && clickedCurrencyData.clickedCurrencyName === '' ? '-' : clickedCurrencyData.clickedCurrencyAmount + ' ' + clickedCurrencyData.clickedCurrencyName}
                </label>
              </div>
                  <div>
                    <p className="font-bold">Choose currency</p>
                    {mapUserOwnedCurrencies()}
                  </div>
                <div className='flex flex-row my-6'>
                <label htmlFor="name" className="font-bold mr-1 flex items-center justify-center"><GiMoneyStack className="cursor-pointer text-white text-2xl mr-2 py-4" /> Amount:</label>
                  <input
                    placeholder="0"
                    id="name"
                    type="number"
                    min="0"
                    max={clickedCurrencyData.clickedCurrencyAmount}
                    disabled={clickedCurrencyData.clickedCurrencyAmount === -1.0}
                    className="w-24 font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none"
                    onChange={handleAmountChange}
                    value={amountToChange}
                  />
                </div>
              <button onClick={() => {!props.isForexWallet ? transferMoneyToForex() : transferMoneyToCasualWallet()}} className='className="py-4 button2 text-white rounded-xl'>Transfer</button>
              </div>
            <button onClick={() => props.closeForexWalletModal()} className="absolute right-2 top-2 ">
              <FaWindowClose className="text-white w-6 inline mr-3 cursor-pointer hover:text-slate-200 " />
            </button>
          </div>
        </div>
      
    );  
}